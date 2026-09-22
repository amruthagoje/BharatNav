import math
import numpy as np
from typing import List, Dict, Any
from app.models.vehicle import VehicleState
from app.models.object_types import TrackedObject, CLASS_PROPERTIES


class DynamicRiskGrid:
    """Computes continuous 2D Dynamic Risk Grid (0.0 to 1.0) around Ego vehicle."""
    def __init__(
        self,
        x_min: float = -10.0,
        x_max: float = 50.0,
        y_min: float = -15.0,
        y_max: float = 15.0,
        resolution: float = 0.5,
        w_prox: float = 0.25,
        w_vel: float = 0.15,
        w_traj: float = 0.25,
        w_ttc: float = 0.20,
        w_class: float = 0.10,
        w_bound: float = 0.05
    ):
        self.x_min = x_min
        self.x_max = x_max
        self.y_min = y_min
        self.y_max = y_max
        self.resolution = resolution
        self.nx = int((x_max - x_min) / resolution)
        self.ny = int((y_max - y_min) / resolution)
        
        # Weights
        self.w_prox = w_prox
        self.w_vel = w_vel
        self.w_traj = w_traj
        self.w_ttc = w_ttc
        self.w_class = w_class
        self.w_bound = w_bound

    def world_to_grid(self, x: float, y: float) -> tuple[int, int]:
        ix = int((x - self.x_min) / self.resolution)
        iy = int((y - self.y_min) / self.resolution)
        return max(0, min(self.nx - 1, ix)), max(0, min(self.ny - 1, iy))

    def grid_to_world(self, ix: int, iy: int) -> tuple[float, float]:
        x = self.x_min + (ix + 0.5) * self.resolution
        y = self.y_min + (iy + 0.5) * self.resolution
        return x, y

    def compute_grid(
        self,
        ego: VehicleState,
        objects: List[TrackedObject],
        road_width: float = 8.0
    ) -> np.ndarray:
        grid = np.zeros((self.ny, self.nx), dtype=np.float64)
        
        # 1. Road boundary risk (penalize driving off-road)
        half_road = road_width / 2.0
        for iy in range(self.ny):
            _, y = self.grid_to_world(0, iy)
            if abs(y) > half_road:
                dist_off = abs(y) - half_road
                boundary_penalty = min(1.0, dist_off / 2.0)
                grid[iy, :] += self.w_bound * boundary_penalty

        # Create coordinate meshgrid for fast vectorized distance computation
        xs = np.linspace(self.x_min + self.resolution/2, self.x_max - self.resolution/2, self.nx)
        ys = np.linspace(self.y_min + self.resolution/2, self.y_max - self.resolution/2, self.ny)
        XX, YY = np.meshgrid(xs, ys)

        for obj in objects:
            dx = XX - obj.x
            dy = YY - obj.y
            dist = np.hypot(dx, dy)
            
            # Proximity Risk (Gaussian dropoff)
            radius = max(obj.width, obj.length) * 1.2
            prox_risk = np.exp(-(dist**2) / (2 * (radius**2)))
            
            # Velocity Risk
            speed = math.hypot(obj.vx, obj.vy)
            vel_risk = min(1.0, speed / 20.0) * prox_risk
            
            # Trajectory Risk (Gaussian along predicted trajectory points)
            traj_risk = np.zeros_like(grid)
            for pt in obj.predicted_trajectory:
                pt_x, pt_y, sigma = pt["x"], pt["y"], pt["sigma"]
                pt_dist = np.hypot(XX - pt_x, YY - pt_y)
                traj_risk += np.exp(-(pt_dist**2) / (2 * (sigma**2)))
            traj_risk = np.clip(traj_risk, 0.0, 1.0)
            
            # TTC Risk
            ttc_risk = 0.0
            if obj.ttc < 1.5:
                ttc_risk = 1.0
            elif obj.ttc < 3.0:
                ttc_risk = 0.7
            elif obj.ttc < 5.0:
                ttc_risk = 0.3
                
            # Class Risk
            class_prop = CLASS_PROPERTIES.get(obj.object_class, {"base_risk": 0.5})
            class_risk = class_prop.get("base_risk", 0.5)
            
            total_obj_risk = (
                self.w_prox * prox_risk +
                self.w_vel * vel_risk +
                self.w_traj * traj_risk +
                self.w_ttc * ttc_risk +
                self.w_class * class_risk * prox_risk
            )
            
            grid = np.maximum(grid, total_obj_risk)
            
        return np.clip(grid, 0.0, 1.0)
