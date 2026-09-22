import math
from pydantic import BaseModel, Field


class VehicleState(BaseModel):
    x: float = 0.0
    y: float = 0.0
    v: float = 0.0  # velocity m/s
    heading: float = 0.0  # yaw angle in radians
    steering_angle: float = 0.0  # radians
    accel: float = 0.0  # m/s^2
    yaw_rate: float = 0.0  # rad/s
    wheelbase: float = 2.8  # meters
    width: float = 2.0  # meters
    length: float = 4.8  # meters
    target_speed: float = 11.11  # m/s (40 km/h)
    risk_level: str = "LOW"
    current_risk_score: float = 0.05
    ttc_min: float = 999.0

    def step_kinematics(self, dt: float = 0.05):
        """Kinematic Bicycle Model Euler Update."""
        self.v = max(0.0, min(30.0, self.v + self.accel * dt))
        self.heading += (self.v / self.wheelbase) * math.tan(self.steering_angle) * dt
        # Normalize heading to [-pi, pi]
        self.heading = (self.heading + math.pi) % (2 * math.pi) - math.pi
        self.x += self.v * math.cos(self.heading) * dt
        self.y += self.v * math.sin(self.heading) * dt
        self.yaw_rate = (self.v / self.wheelbase) * math.tan(self.steering_angle)
