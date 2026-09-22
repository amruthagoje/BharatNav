import math
import numpy as np
from typing import List, Dict
from app.models.object_types import TrackedObject, BehaviorProfile


class MotionPredictor:
    """Predicts future trajectories (1.0 to 5.0 seconds) for tracked road users."""
    def __init__(self, horizon_sec: float = 3.0, step_sec: float = 0.5):
        self.horizon_sec = horizon_sec
        self.step_sec = step_sec

    def predict_trajectories(self, objects: List[TrackedObject]) -> List[TrackedObject]:
        steps = int(self.horizon_sec / self.step_sec)
        
        for obj in objects:
            traj = []
            curr_x = obj.x
            curr_y = obj.y
            curr_vx = obj.vx
            curr_vy = obj.vy
            curr_heading = obj.heading
            
            speed = math.hypot(curr_vx, curr_vy)
            if speed < 0.01 and obj.heading != 0:
                curr_vx = speed * math.cos(obj.heading)
                curr_vy = speed * math.sin(obj.heading)
                
            for t_idx in range(1, steps + 1):
                t = t_idx * self.step_sec
                
                # Apply behavior profile variations
                lat_perturbation = 0.0
                if obj.behavior == BehaviorProfile.ERRATIC:
                    lat_perturbation = 0.8 * math.sin(t * 2.0)
                elif obj.behavior == BehaviorProfile.UNPREDICTABLE:
                    lat_perturbation = 1.2 * math.cos(t * 3.0)
                elif obj.behavior == BehaviorProfile.AGGRESSIVE:
                    curr_vx *= 1.05
                    
                # Predict (x, y)
                px = curr_x + curr_vx * t
                py = curr_y + curr_vy * t + lat_perturbation
                
                # Uncertainty increases over time
                sigma = 0.2 + 0.3 * t
                
                traj.append({
                    "t": round(t, 2),
                    "x": round(float(px), 2),
                    "y": round(float(py), 2),
                    "sigma": round(float(sigma), 2)
                })
                
            obj.predicted_trajectory = traj
            
        return objects
