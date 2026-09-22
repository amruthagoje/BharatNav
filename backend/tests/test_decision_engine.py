import pytest
from app.planning.decision_engine import DecisionEngine, DecisionState


def test_decision_engine_state_transitions():
    engine = DecisionEngine()
    
    # 1. Normal conditions -> CRUISE
    d1 = engine.evaluate(min_ttc=10.0, max_risk=0.1, path_blocked=False)
    assert engine.current_state == DecisionState.CRUISE
    
    # 2. Critical TTC -> EMERGENCY_BRAKE immediately
    d2 = engine.evaluate(min_ttc=1.1, max_risk=0.9, path_blocked=True)
    assert engine.current_state == DecisionState.EMERGENCY_BRAKE
    assert d2["target_accel"] == -6.0
