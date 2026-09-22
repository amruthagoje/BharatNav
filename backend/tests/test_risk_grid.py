import pytest
import numpy as np
from app.models.vehicle import VehicleState
from app.models.object_types import TrackedObject, ObjectClass, BehaviorProfile
from app.risk.risk_grid import DynamicRiskGrid


def test_risk_grid_bounds_and_values():
    grid_builder = DynamicRiskGrid()
    ego = VehicleState(x=0.0, y=0.0, v=10.0)
    
    obj = TrackedObject(
        id="CATTLE_TEST",
        object_class=ObjectClass.ANIMAL,
        x=15.0,
        y=0.0,
        vx=-1.0,
        vy=0.0,
        behavior=BehaviorProfile.UNPREDICTABLE
    )
    
    grid = grid_builder.compute_grid(ego, [obj], road_width=8.0)
    
    # Assert grid dimensions match resolution
    assert grid.shape == (grid_builder.ny, grid_builder.nx)
    
    # Assert all risk grid values are normalized in [0.0, 1.0]
    assert np.all(grid >= 0.0)
    assert np.all(grid <= 1.0)
    
    # Assert cell near obstacle has higher risk than empty space far away
    gx_obj, gy_obj = grid_builder.world_to_grid(15.0, 0.0)
    gx_far, gy_far = grid_builder.world_to_grid(45.0, 0.0)
    assert grid[gy_obj, gx_obj] > grid[gy_far, gx_far]
