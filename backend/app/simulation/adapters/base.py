from abc import ABC, abstractmethod
from typing import Dict, Any
from app.models.scenario import ScenarioConfig


class SimulationAdapter(ABC):
    """Abstract interface for autonomous vehicle simulation backends (Local, RoadRunner, MATLAB)."""
    
    @abstractmethod
    def initialize_scenario(self, scenario: ScenarioConfig):
        pass

    @abstractmethod
    def step(self, dt: float) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_state(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def reset(self):
        pass
