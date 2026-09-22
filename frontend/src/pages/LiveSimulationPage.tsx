import React from 'react';
import { SimulationState } from '../types/simulation';
import { SimulationCanvas } from '../components/simulation/SimulationCanvas';
import { TelemetryPanel } from '../components/simulation/TelemetryPanel';
import { TimelineControls } from '../components/layout/TimelineControls';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface LiveSimulationPageProps {
  state: SimulationState;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  speedMultiplier: number;
  onChangeSpeed: (speed: number) => void;
  onManualReplan: () => void;
}

export const LiveSimulationPage: React.FC<LiveSimulationPageProps> = ({
  state,
  isRunning,
  onTogglePlay,
  onReset,
  speedMultiplier,
  onChangeSpeed,
  onManualReplan,
}) => {
  const isEmergency = state.ego.risk_level === 'CRITICAL' || state.decision === 'EMERGENCY_BRAKE';
  const isReplanning = state.decision === 'REPLAN';

  return (
    <div className={`h-full flex flex-col relative overflow-hidden ${isEmergency ? 'emergency-active' : ''}`}>
      {/* Emergency / Replan Flash Banner */}
      {isEmergency && (
        <div className="bg-danger-red/90 text-white font-mono font-black text-xs py-1.5 px-6 flex items-center justify-between z-30 shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 fill-white text-danger-red" />
            <span>CRITICAL COLLISION RISK DETECTED — EMERGENCY EVASIVE BRAKING ACTIVATED</span>
          </div>
          <span>TTC = {state.ego.ttc_min}s</span>
        </div>
      )}

      {isReplanning && !isEmergency && (
        <div className="bg-warning-amber/90 text-navy-950 font-mono font-black text-xs py-1 px-6 flex items-center justify-between z-30 shadow-lg">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-navy-950 animate-spin" />
            <span>DYNAMIC REPLANNING TRIGGERED: Obstacle Obstructing Corridor</span>
          </div>
          <span>Latency = {state.metrics.avg_replanning_ms}ms</span>
        </div>
      )}

      {/* Main Simulation View Split */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Simulation Canvas Visualizer */}
        <div className="flex-1 h-full relative">
          <SimulationCanvas state={state} />
        </div>

        {/* Live Telemetry Panel */}
        <div className="h-full">
          <TelemetryPanel state={state} onManualReplan={onManualReplan} />
        </div>
      </div>

      {/* Bottom Simulation Timeline Controls */}
      <TimelineControls
        timestamp={state.timestamp}
        isRunning={isRunning}
        onTogglePlay={onTogglePlay}
        onReset={onReset}
        speedMultiplier={speedMultiplier}
        onChangeSpeed={onChangeSpeed}
        completionPct={state.metrics.scenario_completion_pct}
      />
    </div>
  );
};
