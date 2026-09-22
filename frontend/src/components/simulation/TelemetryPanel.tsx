import React from 'react';
import type { SimulationState } from '../../types/simulation';
import { Zap, Terminal, Compass } from 'lucide-react';

interface TelemetryPanelProps {
  state: SimulationState;
  onManualReplan?: () => void;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ state, onManualReplan }) => {
  const { ego, metrics, events, path } = state;

  return (
    <aside className="w-80 h-full bg-navy-950/95 border-l border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto z-10 text-xs select-none">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-electric" />
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">
              Live Vehicle Telemetry
            </h3>
          </div>
          <span className="font-mono text-[10px] text-muted-blue">Hz: 20.0</span>
        </div>

        <div className="glass-panel p-3 rounded-lg border border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Dynamic Risk Level</span>
            <span
              className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded ${
                ego.risk_level === 'CRITICAL'
                  ? 'bg-danger-red/20 text-danger-red border border-danger-red/40 animate-pulse'
                  : ego.risk_level === 'HIGH'
                  ? 'bg-warning-amber/20 text-warning-amber border border-warning-amber/40'
                  : 'bg-safety-green/20 text-safety-green border border-safety-green/40'
              }`}
            >
              {ego.risk_level} ({(ego.current_risk_score * 100).toFixed(0)}%)
            </span>
          </div>

          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-150 ${
                ego.current_risk_score > 0.7
                  ? 'bg-danger-red shadow-lg shadow-danger-red/50'
                  : ego.current_risk_score > 0.4
                  ? 'bg-warning-amber'
                  : 'bg-safety-green'
              }`}
              style={{ width: `${Math.min(100, ego.current_risk_score * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
            <p className="text-[9px] font-mono text-muted-blue uppercase">Speed</p>
            <p className="font-mono font-bold text-sm text-slate-100">
              {ego.v_kmh} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
            </p>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
            <p className="text-[9px] font-mono text-muted-blue uppercase">Accel Command</p>
            <p className="font-mono font-bold text-sm text-slate-100">
              {ego.accel > 0 ? `+${ego.accel}` : ego.accel} <span className="text-[10px] text-slate-400 font-normal">m/s²</span>
            </p>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
            <p className="text-[9px] font-mono text-muted-blue uppercase">Steering Angle</p>
            <p className="font-mono font-bold text-sm text-slate-100">
              {(ego.steering_angle * (180 / Math.PI)).toFixed(1)}°
            </p>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
            <p className="text-[9px] font-mono text-muted-blue uppercase">Min TTC</p>
            <p className="font-mono font-bold text-sm text-slate-100">
              {ego.ttc_min > 90 ? '∞' : `${ego.ttc_min}s`}
            </p>
          </div>
        </div>

        <div className="glass-panel p-3 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Selected Corridor</span>
            <span className="font-mono font-bold text-cyan-electric text-[11px]">
              {path.selected_path || 'PRIMARY_PATH'}
            </span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed italic bg-slate-900/60 p-2 rounded border border-slate-800">
            "{path.reason || 'Optimal collision-free path calculated.'}"
          </p>

          <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-400">
            <span>Smoothness: {path.smoothness_score || 92}%</span>
            <span>Latency: {metrics.avg_replanning_ms || 115}ms</span>
          </div>
        </div>

        {onManualReplan && (
          <button
            onClick={onManualReplan}
            className="w-full py-2 rounded-lg bg-cyan-electric/15 hover:bg-cyan-electric/25 border border-cyan-electric/40 text-cyan-electric font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-cyan-electric/10"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>TRIGGER REPLANNING NOW</span>
          </button>
        )}

        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-saffron" />
            <h4 className="font-bold text-slate-200 text-[10px] uppercase tracking-wider">
              Real-Time Event Log
            </h4>
          </div>

          <div className="h-44 overflow-y-auto bg-navy-950/90 rounded-lg p-2 font-mono text-[10px] border border-slate-800/80 space-y-1.5">
            {events.map((evt, idx) => (
              <div key={idx} className="flex gap-2 leading-tight">
                <span className="text-muted-blue font-semibold shrink-0">{evt.timestamp}</span>
                <span
                  className={
                    evt.type === 'ALERT'
                      ? 'text-danger-red font-bold'
                      : evt.type === 'WARNING'
                      ? 'text-warning-amber'
                      : 'text-slate-300'
                  }
                >
                  {evt.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 text-[9px] font-mono text-muted-blue flex justify-between">
        <span>Collisions Avoided: {metrics.collisions_avoided}</span>
        <span className="text-safety-green font-bold">BharatNav 100% Safe</span>
      </div>
    </aside>
  );
};
