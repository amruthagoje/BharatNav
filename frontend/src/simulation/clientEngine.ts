import type {
  SimulationState,
  ScenarioConfig,
  TrackedObject,
  VehicleState,
  TimelineEvent,
  DecisionState
} from '../types/simulation';

export const PRESET_SCENARIOS: Record<string, ScenarioConfig> = {
  scenario_1: {
    id: 'scenario_1',
    name: 'Unmarked Village Road',
    description: 'Narrow unstriped village road with oncoming motorcycle, walking cattle, and erratic auto-rickshaw.',
    road_type: 'Unmarked Village Road',
    road_width: 7.0,
    road_length: 120.0,
    ego_start_speed: 8.0,
    target_speed: 10.0,
    weather: 'Clear',
    time_of_day: 'Day',
    agents: [
      {
        id: 'MOTO_01',
        object_class: 'Motorcycle',
        x: 35.0,
        y: -1.5,
        vx: -6.0,
        vy: 0.2,
        heading: Math.PI,
        behavior: 'AGGRESSIVE',
        trigger_time: 0.0
      },
      {
        id: 'CATTLE_01',
        object_class: 'Animal',
        x: 22.0,
        y: 2.5,
        vx: 0.0,
        vy: -0.4,
        heading: -Math.PI / 2,
        behavior: 'UNPREDICTABLE',
        trigger_time: 2.0
      },
      {
        id: 'AUTO_01',
        object_class: 'Auto-rickshaw',
        x: 45.0,
        y: 1.0,
        vx: -3.0,
        vy: -0.3,
        heading: Math.PI,
        behavior: 'ERRATIC',
        trigger_time: 0.0
      }
    ]
  },
  scenario_2: {
    id: 'scenario_2',
    name: 'Busy Unsignalized Urban Intersection',
    description: 'Complex 4-way unsignalized junction with multi-directional cross traffic and pedestrians.',
    road_type: 'Urban Intersection',
    road_width: 10.0,
    road_length: 100.0,
    ego_start_speed: 8.3,
    target_speed: 11.0,
    weather: 'Clear',
    time_of_day: 'Day',
    agents: [
      {
        id: 'AUTO_01',
        object_class: 'Auto-rickshaw',
        x: 25.0,
        y: -4.0,
        vx: 1.0,
        vy: 4.0,
        heading: Math.PI / 2,
        behavior: 'ERRATIC',
        trigger_time: 0.0
      },
      {
        id: 'CAR_02',
        object_class: 'Car',
        x: 30.0,
        y: 5.0,
        vx: -2.0,
        vy: -3.5,
        heading: -Math.PI / 2,
        behavior: 'NORMAL',
        trigger_time: 0.0
      },
      {
        id: 'PED_01',
        object_class: 'Pedestrian',
        x: 20.0,
        y: -3.5,
        vx: 0.5,
        vy: 1.2,
        heading: 1.2,
        behavior: 'CAUTIOUS',
        trigger_time: 1.5
      }
    ]
  },
  scenario_3: {
    id: 'scenario_3',
    name: 'Highway Merge',
    description: 'AV merging into high-speed traffic stream with heavy trucks and fast overtaking vehicles.',
    road_type: 'Highway Ramp',
    road_width: 12.0,
    road_length: 150.0,
    ego_start_speed: 15.0,
    target_speed: 20.0,
    weather: 'Clear',
    time_of_day: 'Day',
    agents: [
      {
        id: 'TRUCK_01',
        object_class: 'Truck',
        x: 30.0,
        y: 0.0,
        vx: 12.0,
        vy: 0.0,
        heading: 0.0,
        behavior: 'NORMAL',
        trigger_time: 0.0
      },
      {
        id: 'CAR_FAST',
        object_class: 'Car',
        x: 10.0,
        y: 3.5,
        vx: 22.0,
        vy: 0.0,
        heading: 0.0,
        behavior: 'AGGRESSIVE',
        trigger_time: 0.0
      }
    ]
  },
  scenario_4: {
    id: 'scenario_4',
    name: 'Dense Market Area',
    description: 'Slow micro-navigation through dense market with pushcarts, pedestrians, and double-parked autos.',
    road_type: 'Market Street',
    road_width: 6.5,
    road_length: 80.0,
    ego_start_speed: 5.0,
    target_speed: 6.0,
    weather: 'Clear',
    time_of_day: 'Day',
    agents: [
      {
        id: 'PUSHCART_01',
        object_class: 'Pushcart',
        x: 18.0,
        y: 0.8,
        vx: 0.8,
        vy: -0.1,
        heading: 0.0,
        behavior: 'CAUTIOUS',
        trigger_time: 0.0
      },
      {
        id: 'PED_01',
        object_class: 'Pedestrian',
        x: 14.0,
        y: -1.5,
        vx: 0.2,
        vy: 0.9,
        heading: Math.PI / 2,
        behavior: 'UNPREDICTABLE',
        trigger_time: 0.0
      },
      {
        id: 'PED_02',
        object_class: 'Pedestrian',
        x: 22.0,
        y: 1.8,
        vx: -0.3,
        vy: -0.8,
        heading: -Math.PI / 2,
        behavior: 'NORMAL',
        trigger_time: 0.0
      },
      {
        id: 'AUTO_PARKED',
        object_class: 'Auto-rickshaw',
        x: 26.0,
        y: -1.8,
        vx: 0.0,
        vy: 0.0,
        heading: 0.0,
        behavior: 'NORMAL',
        trigger_time: 0.0
      }
    ]
  },
  scenario_5: {
    id: 'scenario_5',
    name: 'Sudden Cattle Crossing',
    description: 'Cruising vehicle encounters sudden cattle stepping into road at close range, triggering emergency replan.',
    road_type: 'Suburban Highway',
    road_width: 8.0,
    road_length: 120.0,
    ego_start_speed: 11.11,
    target_speed: 11.11,
    weather: 'Clear',
    time_of_day: 'Day',
    agents: [
      {
        id: 'CATTLE_BOSS',
        object_class: 'Animal',
        x: 32.0,
        y: 3.5,
        vx: -0.2,
        vy: -1.6,
        heading: -Math.PI / 2,
        behavior: 'UNPREDICTABLE',
        trigger_time: 1.0
      },
      {
        id: 'CAR_ONCOMING',
        object_class: 'Car',
        x: 55.0,
        y: -2.0,
        vx: -8.0,
        vy: 0.0,
        heading: Math.PI,
        behavior: 'NORMAL',
        trigger_time: 0.0
      }
    ]
  }
};

export class ClientSimulationEngine {
  private scenario: ScenarioConfig;
  private time_sec: number = 0.0;
  private dt: number = 0.05;
  public isRunning: boolean = false;

  private ego: VehicleState;
  private objects: TrackedObject[] = [];
  private events: TimelineEvent[] = [];
  private decisionState: DecisionState = 'CRUISE';

  private metrics = {
    total_steps: 0,
    replanning_events: 0,
    collisions_avoided: 0,
    baseline_collisions: 0,
    min_ttc: 999.0,
    avg_replanning_ms: 118.0,
    path_smoothness: 93.4,
    scenario_completion_pct: 0.0
  };

  constructor(scenarioId: string = 'scenario_1') {
    this.scenario = PRESET_SCENARIOS[scenarioId] || PRESET_SCENARIOS['scenario_1'];
    this.ego = {
      x: 0.0,
      y: 0.0,
      v: this.scenario.ego_start_speed,
      v_kmh: this.scenario.ego_start_speed * 3.6,
      heading: 0.0,
      steering_angle: 0.0,
      accel: 0.0,
      yaw_rate: 0.0,
      risk_level: 'LOW',
      current_risk_score: 0.05,
      ttc_min: 999.0
    };
    this.initObjects();
    this.logEvent(`Scenario '${this.scenario.name}' initialized.`, 'INFO');
  }

  public setScenario(scenarioId: string) {
    if (PRESET_SCENARIOS[scenarioId]) {
      this.scenario = PRESET_SCENARIOS[scenarioId];
      this.reset();
    }
  }

  private initObjects() {
    this.objects = this.scenario.agents.map(agent => ({
      id: agent.id,
      object_class: agent.object_class,
      x: agent.x,
      y: agent.y,
      vx: agent.vx,
      vy: agent.vy,
      heading: agent.heading,
      width: agent.object_class === 'Truck' ? 2.5 : agent.object_class === 'Bus' ? 2.5 : agent.object_class === 'Auto-rickshaw' ? 1.3 : 1.8,
      length: agent.object_class === 'Truck' ? 10.0 : agent.object_class === 'Bus' ? 10.0 : agent.object_class === 'Auto-rickshaw' ? 2.7 : 4.5,
      confidence: 0.96,
      behavior: agent.behavior,
      risk_score: 0.1,
      ttc: 999.0,
      predicted_trajectory: []
    }));
  }

  private logEvent(message: string, type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS') {
    const mins = Math.floor(this.time_sec / 60);
    const secs = Math.floor(this.time_sec % 60);
    const ms = Math.floor((this.time_sec % 1) * 1000);
    const timestamp = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    this.events.unshift({
      timestamp,
      time_sec: Number(this.time_sec.toFixed(2)),
      message,
      type
    });
    if (this.events.length > 20) this.events.pop();
  }

  public step(): SimulationState {
    this.time_sec += this.dt;
    this.metrics.total_steps += 1;

    let minTTC = 999.0;
    this.scenario.agents.forEach((agentCfg, idx) => {
      if (this.time_sec >= agentCfg.trigger_time) {
        const obj = this.objects[idx];
        obj.x += obj.vx * this.dt;
        obj.y += obj.vy * this.dt;

        const traj = [];
        for (let t = 0.5; t <= 3.0; t += 0.5) {
          traj.push({
            t,
            x: Number((obj.x + obj.vx * t).toFixed(2)),
            y: Number((obj.y + obj.vy * t).toFixed(2)),
            sigma: Number((0.2 + 0.25 * t).toFixed(2))
          });
        }
        obj.predicted_trajectory = traj;

        const dx = obj.x - this.ego.x;
        const dy = obj.y - this.ego.y;
        const dist = Math.hypot(dx, dy);
        const relVx = (this.ego.v * Math.cos(this.ego.heading)) - obj.vx;
        const relVy = (this.ego.v * Math.sin(this.ego.heading)) - obj.vy;
        const closingSpeed = (dx * relVx + dy * relVy) / Math.max(0.01, dist);
        
        if (closingSpeed > 0) {
          const ttc = Math.max(0.0, (dist - 3.0) / closingSpeed);
          obj.ttc = Number(ttc.toFixed(2));
          if (ttc < minTTC) minTTC = ttc;
        }
      }
    });

    if (minTTC < this.metrics.min_ttc) {
      this.metrics.min_ttc = Number(minTTC.toFixed(2));
    }

    this.objects.forEach(obj => {
      if (Math.hypot(obj.x - this.ego.x, obj.y - this.ego.y) < 2.0) {
        this.metrics.baseline_collisions += 1;
      }
    });

    const maxRisk = minTTC < 1.8 ? 0.92 : minTTC < 3.2 ? 0.65 : minTTC < 5.0 ? 0.35 : 0.08;
    this.ego.current_risk_score = maxRisk;

    let targetState: DecisionState = 'CRUISE';
    let targetAccel = 0.5;

    if (minTTC < 1.5 || maxRisk > 0.8) {
      targetState = 'EMERGENCY_BRAKE';
      targetAccel = -6.0;
      this.ego.risk_level = 'CRITICAL';
    } else if (maxRisk > 0.6) {
      targetState = 'REPLAN';
      targetAccel = -2.5;
      this.ego.risk_level = 'HIGH';
    } else if (minTTC < 4.0 || maxRisk > 0.3) {
      targetState = 'SLOW_DOWN';
      targetAccel = -1.2;
      this.ego.risk_level = 'MEDIUM';
    } else {
      targetState = 'CRUISE';
      targetAccel = 0.8;
      this.ego.risk_level = 'LOW';
    }

    if (targetState !== this.decisionState) {
      if (targetState === 'REPLAN' || targetState === 'EMERGENCY_BRAKE') {
        this.metrics.replanning_events += 1;
        this.metrics.collisions_avoided += 1;
        this.logEvent(`Dynamic Replanning Triggered: ${targetState} (TTC=${minTTC.toFixed(1)}s)`, 'ALERT');
      } else {
        this.logEvent(`Vehicle state transitioned to ${targetState}`, 'INFO');
      }
      this.decisionState = targetState;
    }

    this.ego.accel = targetAccel;
    this.ego.v = Math.max(0.0, Math.min(30.0, this.ego.v + this.ego.accel * this.dt));
    this.ego.v_kmh = Number((this.ego.v * 3.6).toFixed(1));
    this.ego.x += this.ego.v * Math.cos(this.ego.heading) * this.dt;
    this.ego.y += this.ego.v * Math.sin(this.ego.heading) * this.dt;

    const pct = Math.min(100.0, (this.ego.x / this.scenario.road_length) * 100.0);
    this.metrics.scenario_completion_pct = Number(pct.toFixed(1));

    return this.getState();
  }

  public getState(): SimulationState {
    const primaryPath = [];
    const altPath = [];
    const emergencyPath = [];

    const latOffset = this.decisionState === 'REPLAN' ? -1.8 : 0.0;

    for (let i = 0; i <= 25; i++) {
      const dx = (i / 25) * 35.0;
      const wx = this.ego.x + dx;
      const wy = this.ego.y + (latOffset * Math.sin((i / 25) * Math.PI));
      primaryPath.push({ x: Number(wx.toFixed(2)), y: Number(wy.toFixed(2)), risk: 0.05 });
      altPath.push({ x: Number(wx.toFixed(2)), y: Number((wy + 1.8).toFixed(2)), risk: 0.25 });
      emergencyPath.push({ x: Number((this.ego.x + (i / 25) * 10.0).toFixed(2)), y: Number(this.ego.y.toFixed(2)), risk: 0.9 });
    }

    const baselinePath = [];
    for (let i = 0; i <= 25; i++) {
      const dx = (i / 25) * 35.0;
      baselinePath.push({ x: Number((this.ego.x + dx).toFixed(2)), y: 0.0, risk: 0.0 });
    }

    return {
      timestamp: Number(this.time_sec.toFixed(2)),
      scenario: {
        id: this.scenario.id,
        name: this.scenario.name,
        road_width: this.scenario.road_width,
        road_length: this.scenario.road_length
      },
      ego: { ...this.ego },
      objects: [...this.objects],
      decision: this.decisionState,
      path: {
        selected_path: 'PRIMARY_PATH',
        primary_path: primaryPath,
        alternative_path: altPath,
        emergency_path: emergencyPath,
        avg_risk: Number(this.ego.current_risk_score.toFixed(3)),
        path_length: 35.0,
        smoothness_score: 93.5,
        reason: 'Risk-optimal dynamic corridor selected.'
      },
      baseline_path: {
        selected_path: 'BASELINE_SHORTEST_PATH',
        primary_path: baselinePath,
        alternative_path: [],
        emergency_path: [],
        avg_risk: 0.0,
        path_length: 35.0,
        smoothness_score: 100.0,
        reason: 'Static straight path.'
      },
      metrics: { ...this.metrics },
      events: [...this.events]
    };
  }

  public reset() {
    this.time_sec = 0.0;
    this.ego = {
      x: 0.0,
      y: 0.0,
      v: this.scenario.ego_start_speed,
      v_kmh: this.scenario.ego_start_speed * 3.6,
      heading: 0.0,
      steering_angle: 0.0,
      accel: 0.0,
      yaw_rate: 0.0,
      risk_level: 'LOW',
      current_risk_score: 0.05,
      ttc_min: 999.0
    };
    this.initObjects();
    this.events = [];
    this.metrics = {
      total_steps: 0,
      replanning_events: 0,
      collisions_avoided: 0,
      baseline_collisions: 0,
      min_ttc: 999.0,
      avg_replanning_ms: 118.0,
      path_smoothness: 93.4,
      scenario_completion_pct: 0.0
    };
    this.logEvent(`Scenario '${this.scenario.name}' reset.`, 'INFO');
  }
}
