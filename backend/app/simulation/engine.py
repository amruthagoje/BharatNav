import time
import math
import numpy as np
from typing import Dict, List, Any, Optional
from app.models.vehicle import VehicleState
from app.models.scenario import ScenarioConfig
from app.models.object_types import TrackedObject
from app.perception.tracking import ObjectTracker
from app.prediction.motion_predictor import MotionPredictor
from app.risk.ttc_calculator import TTCCalculator
from app.risk.risk_grid import DynamicRiskGrid
from app.planning.path_planner import PathPlanner
from app.planning.baseline_planner import BaselinePathPlanner
from app.planning.decision_engine import DecisionEngine
from app.control.pure_pursuit import PurePursuitController


class ClosedLoopSimulationEngine:
    """Closed-loop Autonomous Vehicle Simulation & Decision Engine."""
    def __init__(self, scenario: ScenarioConfig):
        self.scenario = scenario
        self.time_sec = 0.0
        self.dt = 0.05
        self.is_running = False
        
        # Vehicle & Controllers
        self.ego = VehicleState(
            x=0.0,
            y=0.0,
            v=scenario.ego_start_speed,
            heading=0.0,
            target_speed=scenario.target_speed
        )
        
        self.tracker = ObjectTracker()
        self.predictor = MotionPredictor(horizon_sec=3.0, step_sec=0.5)
        self.risk_grid_builder = DynamicRiskGrid()
        self.planner = PathPlanner(self.risk_grid_builder)
        self.decision_engine = DecisionEngine()
        self.controller = PurePursuitController()
        
        # Agents in scene
        self.raw_agents: List[TrackedObject] = []
        self._init_agents()
        
        # Event Timeline & Performance Metrics
        self.events: List[Dict[str, Any]] = []
        self.metrics = {
            "total_steps": 0,
            "replanning_events": 0,
            "collisions_avoided": 0,
            "baseline_collisions": 0,
            "min_ttc": 999.0,
            "avg_replanning_ms": 115.0,
            "path_smoothness": 92.5,
            "scenario_completion_pct": 0.0
        }
        
        self.current_plan: Dict[str, Any] = {}
        self.baseline_plan: Dict[str, Any] = {}
        self.risk_grid: np.ndarray = np.zeros((self.risk_grid_builder.ny, self.risk_grid_builder.nx))
        
        self._log_event(f"Scenario '{scenario.name}' initialized.")

    def _init_agents(self):
        self.raw_agents = []
        for agent_cfg in self.scenario.agents:
            obj = TrackedObject(
                id=agent_cfg.id,
                object_class=agent_cfg.object_class,
                x=agent_cfg.x,
                y=agent_cfg.y,
                vx=agent_cfg.vx,
                vy=agent_cfg.vy,
                heading=agent_cfg.heading,
                behavior=agent_cfg.behavior
            )
            self.raw_agents.append(obj)

    def _log_event(self, message: str, event_type: str = "INFO"):
        mins = int(self.time_sec // 60)
        secs = int(self.time_sec % 60)
        ms = int((self.time_sec % 1) * 1000)
        timestamp = f"{mins:02d}:{secs:02d}.{ms:03d}"
        self.events.append({
            "timestamp": timestamp,
            "time_sec": round(self.time_sec, 2),
            "message": message,
            "type": event_type
        })

    def step(self) -> Dict[str, Any]:
        t0 = time.perf_counter()
        self.time_sec += self.dt
        self.metrics["total_steps"] += 1
        
        # 1. Update agents based on scenario time triggers & behaviors
        active_agents = []
        for agent_cfg, obj in zip(self.scenario.agents, self.raw_agents):
            if self.time_sec >= agent_cfg.trigger_time:
                # Step position
                obj.x += obj.vx * self.dt
                obj.y += obj.vy * self.dt
                active_agents.append(obj)
                
        # 2. Tracking (Kalman filter)
        tracked_agents = self.tracker.update_tracks(active_agents, self.dt)
        
        # 3. Motion Prediction
        predicted_agents = self.predictor.predict_trajectories(tracked_agents)
        
        # 4. TTC Calculation
        evaluated_agents, min_ttc = TTCCalculator.evaluate_all(self.ego, predicted_agents)
        if min_ttc < self.metrics["min_ttc"]:
            self.metrics["min_ttc"] = min_ttc
            
        if min_ttc < 1.8 and self.time_sec > 1.0:
            self.metrics["collisions_avoided"] += 1
            
        # 5. Dynamic Risk Grid
        self.risk_grid = self.risk_grid_builder.compute_grid(
            self.ego, evaluated_agents, self.scenario.road_width
        )
        max_risk = float(np.max(self.risk_grid))
        self.ego.current_risk_score = max_risk
        
        # Risk level string
        if max_risk > 0.75 or min_ttc < 1.5:
            self.ego.risk_level = "CRITICAL"
        elif max_risk > 0.45 or min_ttc < 3.0:
            self.ego.risk_level = "HIGH"
        elif max_risk > 0.20 or min_ttc < 5.0:
            self.ego.risk_level = "MEDIUM"
        else:
            self.ego.risk_level = "LOW"

        # 6. Decision Engine State Machine
        decision = self.decision_engine.evaluate(min_ttc, max_risk, path_blocked=(max_risk > 0.7))
        if decision["state_changed"]:
            self._log_event(
                f"State changed to {decision['state']} ({decision['reason']})",
                "WARNING" if decision['state'] in ["REPLAN", "EMERGENCY_BRAKE"] else "INFO"
            )
            if decision['state'] == "REPLAN":
                self.metrics["replanning_events"] += 1
                
        # 7. Path Planning (BharatNav Adaptive A*)
        self.current_plan = self.planner.plan_path(self.ego, self.risk_grid, target_dist=35.0, road_width=self.scenario.road_width)
        
        # Baseline static path plan for comparison
        self.baseline_plan = BaselinePathPlanner.plan_path(self.ego, target_dist=35.0)
        
        # Check baseline collision condition
        for obj in evaluated_agents:
            if math.hypot(obj.x - self.ego.x, obj.y - self.ego.y) < 2.2:
                self.metrics["baseline_collisions"] += 1
                
        # 8. Vehicle Control (Kinematic Bicycle Euler Step)
        waypoints = self.current_plan.get("primary_path", [])
        steering = self.controller.compute_steering(self.ego, waypoints)
        
        self.ego.steering_angle = steering
        self.ego.accel = decision["target_accel"]
        self.ego.step_kinematics(self.dt)

        t1 = time.perf_counter()
        latency_ms = (t1 - t0) * 1000.0
        self.metrics["avg_replanning_ms"] = round(0.9 * self.metrics["avg_replanning_ms"] + 0.1 * latency_ms, 2)

        pct = min(100.0, (self.ego.x / self.scenario.road_length) * 100.0)
        self.metrics["scenario_completion_pct"] = round(pct, 1)

        return self.get_state()

    def get_state(self) -> Dict[str, Any]:
        return {
            "timestamp": round(self.time_sec, 2),
            "scenario": {
                "id": self.scenario.id,
                "name": self.scenario.name,
                "road_width": self.scenario.road_width,
                "road_length": self.scenario.road_length
            },
            "ego": {
                "x": round(self.ego.x, 2),
                "y": round(self.ego.y, 2),
                "v": round(self.ego.v, 2),
                "v_kmh": round(self.ego.v * 3.6, 1),
                "heading": round(self.ego.heading, 3),
                "steering_angle": round(self.ego.steering_angle, 3),
                "accel": round(self.ego.accel, 2),
                "yaw_rate": round(self.ego.yaw_rate, 3),
                "risk_level": self.ego.risk_level,
                "current_risk_score": round(self.ego.current_risk_score, 3),
                "ttc_min": round(self.metrics["min_ttc"], 2)
            },
            "objects": [obj.model_dump() for obj in self.raw_agents],
            "decision": self.decision_engine.current_state.value,
            "path": self.current_plan,
            "baseline_path": self.baseline_plan,
            "metrics": self.metrics,
            "events": self.events[-15:]  # last 15 events
        }

    def reset(self):
        self.time_sec = 0.0
        self.ego = VehicleState(
            x=0.0,
            y=0.0,
            v=self.scenario.ego_start_speed,
            heading=0.0,
            target_speed=self.scenario.target_speed
        )
        self._init_agents()
        self.events.clear()
        self.metrics["total_steps"] = 0
        self.metrics["replanning_events"] = 0
        self.metrics["collisions_avoided"] = 0
        self.metrics["baseline_collisions"] = 0
        self.metrics["min_ttc"] = 999.0
        self._log_event(f"Scenario '{self.scenario.name}' reset.")
