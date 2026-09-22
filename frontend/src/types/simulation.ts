export type ObjectClass =
  | 'Car'
  | 'Bus'
  | 'Truck'
  | 'Motorcycle'
  | 'Bicycle'
  | 'Auto-rickshaw'
  | 'Pedestrian'
  | 'Animal'
  | 'Pushcart'
  | 'Obstacle';

export type BehaviorProfile = 'NORMAL' | 'CAUTIOUS' | 'AGGRESSIVE' | 'ERRATIC' | 'UNPREDICTABLE';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type DecisionState = 'CRUISE' | 'CAUTION' | 'SLOW_DOWN' | 'REPLAN' | 'EMERGENCY_BRAKE';

export interface PredictedPoint {
  t: number;
  x: number;
  y: number;
  sigma: number;
}

export interface TrackedObject {
  id: string;
  object_class: ObjectClass;
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number;
  width: number;
  length: number;
  confidence: number;
  behavior: BehaviorProfile;
  risk_score: number;
  ttc: number;
  predicted_trajectory: PredictedPoint[];
}

export interface VehicleState {
  x: number;
  y: number;
  v: number;
  v_kmh: number;
  heading: number;
  steering_angle: number;
  accel: number;
  yaw_rate: number;
  risk_level: RiskLevel;
  current_risk_score: number;
  ttc_min: number;
}

export interface PathPoint {
  x: number;
  y: number;
  risk: number;
}

export interface PathPlan {
  selected_path: string;
  primary_path: PathPoint[];
  alternative_path: PathPoint[];
  emergency_path: PathPoint[];
  avg_risk: number;
  path_length: number;
  smoothness_score: number;
  reason: string;
}

export interface SimulationMetrics {
  total_steps: number;
  replanning_events: number;
  collisions_avoided: number;
  baseline_collisions: number;
  min_ttc: number;
  avg_replanning_ms: number;
  path_smoothness: number;
  scenario_completion_pct: number;
}

export interface TimelineEvent {
  timestamp: string;
  time_sec: number;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';
}

export interface ScenarioConfig {
  id: string;
  name: string;
  description: string;
  road_type: string;
  road_width: number;
  road_length: number;
  ego_start_speed: number;
  target_speed: number;
  weather: string;
  time_of_day: string;
  agents: {
    id: string;
    object_class: ObjectClass;
    x: number;
    y: number;
    vx: number;
    vy: number;
    heading: number;
    behavior: BehaviorProfile;
    trigger_time: number;
  }[];
}

export interface SimulationState {
  timestamp: number;
  scenario: {
    id: string;
    name: string;
    road_width: number;
    road_length: number;
  };
  ego: VehicleState;
  objects: TrackedObject[];
  decision: DecisionState;
  path: PathPlan;
  baseline_path: PathPlan;
  metrics: SimulationMetrics;
  events: TimelineEvent[];
}

export type ViewMode =
  | 'overview'
  | 'simulation'
  | 'risk-grid'
  | 'perception'
  | 'prediction'
  | 'path-planning'
  | 'scenarios'
  | 'analytics'
  | 'research'
  | 'architecture'
  | 'settings';
