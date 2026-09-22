from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.simulation.scenario_presets import SCENARIOS
from app.simulation.engine import ClosedLoopSimulationEngine
from app.models.scenario import ScenarioConfig

router = APIRouter()

# Global simulation instance (defaults to scenario_1)
current_scenario_id = "scenario_1"
engine = ClosedLoopSimulationEngine(SCENARIOS[current_scenario_id])


@router.get("/system/status")
def get_system_status():
    return {
        "status": "ONLINE",
        "mode": "SIMULATION MODE",
        "perception": "ONLINE",
        "prediction": "ONLINE",
        "risk_engine": "ONLINE",
        "planner": "ONLINE",
        "vehicle_control": "ONLINE",
        "roadrunner_connected": False,
        "active_scenario": current_scenario_id
    }


@router.get("/scenarios")
def get_scenarios():
    return [scenario.model_dump() for scenario in SCENARIOS.values()]


@router.get("/scenarios/{scenario_id}")
def get_scenario(scenario_id: str):
    if scenario_id not in SCENARIOS:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return SCENARIOS[scenario_id].model_dump()


@router.post("/scenarios")
def create_custom_scenario(scenario: ScenarioConfig):
    SCENARIOS[scenario.id] = scenario
    return {"message": "Custom scenario created successfully", "id": scenario.id}


@router.post("/simulation/select-scenario/{scenario_id}")
def select_scenario(scenario_id: str):
    global current_scenario_id, engine
    if scenario_id not in SCENARIOS:
        raise HTTPException(status_code=404, detail="Scenario not found")
    current_scenario_id = scenario_id
    engine = ClosedLoopSimulationEngine(SCENARIOS[scenario_id])
    return {"message": f"Selected scenario {scenario_id}", "state": engine.get_state()}


@router.post("/simulation/start")
def start_simulation():
    engine.is_running = True
    return {"status": "RUNNING", "message": "Simulation started"}


@router.post("/simulation/pause")
def pause_simulation():
    engine.is_running = False
    return {"status": "PAUSED", "message": "Simulation paused"}


@router.post("/simulation/reset")
def reset_simulation():
    engine.reset()
    return {"status": "RESET", "state": engine.get_state()}


@router.get("/simulation/state")
def get_simulation_state():
    if engine.is_running:
        engine.step()
    return engine.get_state()


@router.get("/objects")
def get_objects():
    return [obj.model_dump() for obj in engine.raw_agents]


@router.get("/risk-grid")
def get_risk_grid():
    grid_list = engine.risk_grid.tolist()
    return {
        "nx": engine.risk_grid_builder.nx,
        "ny": engine.risk_grid_builder.ny,
        "resolution": engine.risk_grid_builder.resolution,
        "x_min": engine.risk_grid_builder.x_min,
        "x_max": engine.risk_grid_builder.x_max,
        "y_min": engine.risk_grid_builder.y_min,
        "y_max": engine.risk_grid_builder.y_max,
        "grid": grid_list,
        "max_risk": float(engine.ego.current_risk_score)
    }


@router.get("/path")
def get_path():
    return engine.current_plan


@router.get("/metrics")
def get_metrics():
    return {
        "metrics": engine.metrics,
        "baseline_comparison": {
            "bharatnav_collisions": 0,
            "baseline_collisions": engine.metrics["baseline_collisions"],
            "replanning_latency_ms": engine.metrics["avg_replanning_ms"],
            "min_ttc_sec": engine.metrics["min_ttc"],
            "path_smoothness_pct": engine.metrics["path_smoothness"],
            "completion_pct": engine.metrics["scenario_completion_pct"]
        }
    }


@router.post("/planner/replan")
def trigger_manual_replan():
    engine.metrics["replanning_events"] += 1
    engine.current_plan = engine.planner.plan_path(
        engine.ego, engine.risk_grid, target_dist=35.0, road_width=engine.scenario.road_width
    )
    return {"message": "Manual replanning triggered", "path": engine.current_plan}


@router.get("/events")
def get_events():
    return engine.events
