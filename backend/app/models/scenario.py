from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.object_types import ObjectClass, BehaviorProfile


class InitialAgentConfig(BaseModel):
    id: str
    object_class: ObjectClass
    x: float
    y: float
    vx: float = 0.0
    vy: float = 0.0
    heading: float = 0.0
    behavior: BehaviorProfile = BehaviorProfile.NORMAL
    trigger_time: float = 0.0  # Time in seconds when obstacle appears or starts moving


class ScenarioConfig(BaseModel):
    id: str
    name: str
    description: str
    road_type: str = "Unmarked Village Road"
    road_width: float = 8.0  # meters
    road_length: float = 120.0  # meters
    ego_start_speed: float = 10.0  # m/s (~36 km/h)
    target_speed: float = 11.11  # m/s (~40 km/h)
    weather: str = "Clear"
    time_of_day: str = "Day"
    agents: List[InitialAgentConfig] = Field(default_factory=list)
