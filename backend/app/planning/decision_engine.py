from enum import Enum
from typing import Dict, Any


class DecisionState(str, Enum):
    CRUISE = "CRUISE"
    CAUTION = "CAUTION"
    SLOW_DOWN = "SLOW_DOWN"
    REPLAN = "REPLAN"
    EMERGENCY_BRAKE = "EMERGENCY_BRAKE"


class DecisionEngine:
    """State machine for autonomous vehicle speed & evasive decision making."""
    def __init__(self):
        self.current_state = DecisionState.CRUISE
        self.state_counter = 0

    def evaluate(self, min_ttc: float, max_risk: float, path_blocked: bool) -> Dict[str, Any]:
        prev_state = self.current_state
        target_state = DecisionState.CRUISE

        if min_ttc < 1.5 or max_risk > 0.85:
            target_state = DecisionState.EMERGENCY_BRAKE
        elif path_blocked or max_risk > 0.65:
            target_state = DecisionState.REPLAN
        elif min_ttc < 3.0 or max_risk > 0.45:
            target_state = DecisionState.SLOW_DOWN
        elif min_ttc < 5.0 or max_risk > 0.25:
            target_state = DecisionState.CAUTION
        else:
            target_state = DecisionState.CRUISE

        # Debouncing hysteresis (prevents rapid state toggling)
        if target_state != prev_state:
            self.state_counter += 1
            if self.state_counter >= 2 or target_state == DecisionState.EMERGENCY_BRAKE:
                self.current_state = target_state
                self.state_counter = 0
        else:
            self.state_counter = 0

        # Calculate acceleration command
        accel = 0.5  # default cruise acceleration
        if self.current_state == DecisionState.CRUISE:
            accel = 0.8
        elif self.current_state == DecisionState.CAUTION:
            accel = -0.5
        elif self.current_state == DecisionState.SLOW_DOWN:
            accel = -1.8
        elif self.current_state == DecisionState.REPLAN:
            accel = -2.5
        elif self.current_state == DecisionState.EMERGENCY_BRAKE:
            accel = -6.0

        return {
            "state": self.current_state.value,
            "target_accel": accel,
            "state_changed": self.current_state != prev_state,
            "reason": f"TTC={min_ttc:.1f}s, MaxRisk={max_risk:.2f}"
        }
