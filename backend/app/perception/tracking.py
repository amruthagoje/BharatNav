import numpy as np
from typing import List, Dict
from app.models.object_types import TrackedObject, ObjectClass, BehaviorProfile, CLASS_PROPERTIES


class KalmanFilter2D:
    """Simple 2D Linear Kalman Filter for (x, y, vx, vy) tracking."""
    def __init__(self, x: float, y: float, vx: float = 0.0, vy: float = 0.0):
        # State vector [x, y, vx, vy]^T
        self.state = np.array([x, y, vx, vy], dtype=np.float64)
        
        # State transition matrix F (constant velocity model)
        self.F = np.eye(4)
        
        # Covariance matrix P
        self.P = np.eye(4) * 1.0
        
        # Measurement matrix H (measuring x and y)
        self.H = np.array([
            [1, 0, 0, 0],
            [0, 1, 0, 0]
        ], dtype=np.float64)
        
        # Process noise R
        self.R = np.eye(2) * 0.1
        
        # Measurement noise Q
        self.Q = np.eye(4) * 0.05

    def predict(self, dt: float = 0.05):
        self.F[0, 2] = dt
        self.F[1, 3] = dt
        self.state = self.F @ self.state
        self.P = self.F @ self.P @ self.F.T + self.Q
        return self.state

    def update(self, z: np.ndarray):
        """z is measurement [x, y]"""
        y = z - (self.H @ self.state)
        S = self.H @ self.P @ self.H.T + self.R
        K = self.P @ self.H.T @ np.linalg.inv(S)
        self.state = self.state + (K @ y)
        self.P = (np.eye(4) - K @ self.H) @ self.P
        return self.state


class ObjectTracker:
    """Multi-object tracker with Kalman Filter per tracked agent."""
    def __init__(self):
        self.filters: Dict[str, KalmanFilter2D] = {}

    def update_tracks(self, raw_objects: List[TrackedObject], dt: float = 0.05) -> List[TrackedObject]:
        updated_objects: List[TrackedObject] = []
        for obj in raw_objects:
            if obj.id not in self.filters:
                self.filters[obj.id] = KalmanFilter2D(obj.x, obj.y, obj.vx, obj.vy)
            
            kf = self.filters[obj.id]
            kf.predict(dt)
            kf.update(np.array([obj.x, obj.y]))
            
            # Extract smoothed state
            sx, sy, svx, svy = kf.state
            
            obj_props = CLASS_PROPERTIES.get(obj.object_class, {"length": 2.0, "width": 1.0})
            
            updated = TrackedObject(
                id=obj.id,
                object_class=obj.object_class,
                x=float(sx),
                y=float(sy),
                vx=float(svx),
                vy=float(svy),
                heading=obj.heading,
                width=obj_props.get("width", obj.width),
                length=obj_props.get("length", obj.length),
                confidence=obj.confidence,
                behavior=obj.behavior,
                risk_score=obj.risk_score,
                ttc=obj.ttc
            )
            updated_objects.append(updated)
        return updated_objects
