import math
from typing import List, Dict
from app.models.vehicle import VehicleState


class PurePursuitController:
    """Pure Pursuit lateral trajectory tracking controller."""
    def __init__(self, k_lookahead: float = 0.5, min_lookahead: float = 3.0, max_steer: float = 0.6):
        self.k_lookahead = k_lookahead
        self.min_lookahead = min_lookahead
        self.max_steer = max_steer

    def compute_steering(self, ego: VehicleState, waypoints: List[Dict[str, float]]) -> float:
        if not waypoints:
            return 0.0

        lookahead_dist = max(self.min_lookahead, self.k_lookahead * ego.v)
        
        # Find lookahead target point along waypoints
        target_pt = waypoints[-1]
        for pt in waypoints:
            dx = pt["x"] - ego.x
            dy = pt["y"] - ego.y
            dist = math.hypot(dx, dy)
            if dist >= lookahead_dist:
                target_pt = pt
                break

        dx = target_pt["x"] - ego.x
        dy = target_pt["y"] - ego.y
        
        # Heading to target in vehicle local frame
        target_heading = math.atan2(dy, dx)
        alpha = target_heading - ego.heading
        # Normalize alpha to [-pi, pi]
        alpha = (alpha + math.pi) % (2 * math.pi) - math.pi

        ld = math.hypot(dx, dy)
        if ld < 0.01:
            return 0.0

        steering = math.atan2(2.0 * ego.wheelbase * math.sin(alpha), ld)
        return max(-self.max_steer, min(self.max_steer, steering))
