from enum import Enum
from typing import Dict, Any
from pydantic import BaseModel, Field


class ObjectClass(str, Enum):
    CAR = "Car"
    BUS = "Bus"
    TRUCK = "Truck"
    MOTORCYCLE = "Motorcycle"
    BICYCLE = "Bicycle"
    AUTO_RICKSHAW = "Auto-rickshaw"
    PEDESTRIAN = "Pedestrian"
    ANIMAL = "Animal"
    PUSHCART = "Pushcart"
    OBSTACLE = "Obstacle"


class BehaviorProfile(str, Enum):
    NORMAL = "NORMAL"
    CAUTIOUS = "CAUTIOUS"
    AGGRESSIVE = "AGGRESSIVE"
    ERRATIC = "ERRATIC"
    UNPREDICTABLE = "UNPREDICTABLE"


CLASS_PROPERTIES: Dict[ObjectClass, Dict[str, Any]] = {
    ObjectClass.CAR: {"length": 4.5, "width": 1.8, "base_risk": 0.5, "unpredictability": 0.2},
    ObjectClass.BUS: {"length": 10.0, "width": 2.5, "base_risk": 0.7, "unpredictability": 0.3},
    ObjectClass.TRUCK: {"length": 12.0, "width": 2.6, "base_risk": 0.8, "unpredictability": 0.3},
    ObjectClass.MOTORCYCLE: {"length": 2.0, "width": 0.8, "base_risk": 0.75, "unpredictability": 0.6},
    ObjectClass.BICYCLE: {"length": 1.8, "width": 0.6, "base_risk": 0.7, "unpredictability": 0.5},
    ObjectClass.AUTO_RICKSHAW: {"length": 2.7, "width": 1.3, "base_risk": 0.85, "unpredictability": 0.85},
    ObjectClass.PEDESTRIAN: {"length": 0.6, "width": 0.6, "base_risk": 0.9, "unpredictability": 0.75},
    ObjectClass.ANIMAL: {"length": 1.8, "width": 0.8, "base_risk": 1.0, "unpredictability": 0.95},
    ObjectClass.PUSHCART: {"length": 2.2, "width": 1.2, "base_risk": 0.65, "unpredictability": 0.5},
    ObjectClass.OBSTACLE: {"length": 1.0, "width": 1.0, "base_risk": 0.95, "unpredictability": 0.0},
}


class TrackedObject(BaseModel):
    id: str
    object_class: ObjectClass
    x: float
    y: float
    vx: float = 0.0
    vy: float = 0.0
    ax: float = 0.0
    ay: float = 0.0
    heading: float = 0.0  # radians
    width: float = 1.8
    length: float = 4.5
    confidence: float = 0.95
    behavior: BehaviorProfile = BehaviorProfile.NORMAL
    risk_score: float = 0.0
    ttc: float = 999.0
    predicted_trajectory: list[dict[str, float]] = Field(default_factory=list)
