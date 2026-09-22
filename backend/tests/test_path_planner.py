import pytest
import numpy as np
from app.models.vehicle import VehicleState
from app.risk.risk_grid import DynamicRiskGrid
from app.planning.path_planner import PathPlanner


def test_path_planner_generates_valid_path():
    grid_builder = DynamicRiskGrid()
    ego = VehicleState(x=0.0, y=0.0, v=10.0)
    grid = np.zeros((grid_builder.ny, grid_builder.nx))
    
    planner = PathPlanner(grid_builder)
    plan = planner.plan_path(ego, grid, target_dist=30.0, road_width=8.0)
    
    assert "primary_path" in plan
    assert len(plan["primary_path"]) > 0
    assert "alternative_path" in plan
    assert plan["selected_path"] == "PRIMARY_PATH"
