import math
from typing import List, Dict, Any
from app.models.vehicle import VehicleState


class BaselinePathPlanner:
    """Static Shortest-Path Planner (ignores dynamic risk grid & object predictions)."""
    
    @staticmethod
    def plan_path(ego: VehicleState, target_dist: float = 35.0, steps: int = 30) -> Dict[str, Any]:
        path = []
        for i in range(steps):
            d = (i / float(steps)) * target_dist
            px = ego.x + d * math.cos(ego.heading)
            py = ego.y  # Pure straight centerline
            path.append({"x": round(px, 2), "y": round(py, 2), "risk": 0.0})
            
        return {
            "selected_path": "BASELINE_SHORTEST_PATH",
            "primary_path": path,
            "avg_risk": 0.0,
            "path_length": round(target_dist, 2),
            "smoothness_score": 100.0,
            "reason": "Static straight line path regardless of obstacles."
        }
