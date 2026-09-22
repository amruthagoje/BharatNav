import math
from typing import List, Tuple
from app.models.vehicle import VehicleState
from app.models.object_types import TrackedObject


class TTCCalculator:
    """Calculates Time-To-Collision (TTC) for all surrounding objects."""
    
    @staticmethod
    def calculate_ttc(ego: VehicleState, obj: TrackedObject) -> float:
        dx = obj.x - ego.x
        dy = obj.y - ego.y
        dist = math.hypot(dx, dy)
        
        # Ego velocity vector
        ego_vx = ego.v * math.cos(ego.heading)
        ego_vy = ego.v * math.sin(ego.heading)
        
        # Relative velocity vector (Ego minus object approach)
        rel_vx = ego_vx - obj.vx
        rel_vy = ego_vy - obj.vy
        
        # Closing speed towards object position
        if dist < 0.01:
            return 0.0
            
        closing_speed = (dx * rel_vx + dy * rel_vy) / dist
        
        if closing_speed <= 0.0:
            return 999.0  # Moving away or parallel
            
        # Effective safety buffer accounts for vehicle size
        safety_dist = max(0.1, dist - (ego.length / 2.0 + obj.length / 2.0))
        ttc = safety_dist / closing_speed
        return max(0.0, round(ttc, 2))

    @classmethod
    def evaluate_all(cls, ego: VehicleState, objects: List[TrackedObject]) -> Tuple[List[TrackedObject], float]:
        min_ttc = 999.0
        for obj in objects:
            ttc = cls.calculate_ttc(ego, obj)
            obj.ttc = ttc
            if ttc < min_ttc:
                min_ttc = ttc
        return objects, min_ttc
