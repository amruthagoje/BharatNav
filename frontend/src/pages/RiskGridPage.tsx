import React, { useState } from 'react';
import { SimulationState } from '../types/simulation';
import { Grid3X3, Sliders, Shield, Info, Activity } from 'lucide-react';

interface RiskGridPageProps {
  state: SimulationState;
}

export const RiskGridPage: React.FC<RiskGridPageProps> = ({ state }) => {
  const [weights, setWeights] = useState({
    w_prox: 0.25,
    w_vel: 0.15,
    w_traj: 0.25,
    w_ttc: 0.20,
    w_class: 0.10,
    w_bound: 0.05,
  });

  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Grid3X3 className="w-5 h-5 text-cyan-electric" />
            <h2 className="text-xl font-extrabold text-slate-100">Dynamic Risk Grid Engine</h2>
          </div>
          <p className="text-xs text-muted-blue font-mono mt-1">
            2D Continuous Risk Mesh (0.0 to 1.0) & Trajectory Field Evaluation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Current Grid Peak Risk:</span>
          <span
            className={`font-mono font-black text-sm px-3 py-1 rounded ${
              state.ego.current_risk_score > 0.7
                ? 'bg-danger-red/20 text-danger-red border border-danger-red/40'
                : 'bg-safety-green/20 text-safety-green border border-safety-green/40'
            }`}
          >
            {(state.ego.current_risk_score * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Grid Formula & Interactive Weights */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left 2 Cols: Risk Formula & Component Cards */}
        <div className="col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-saffron font-mono text-xs font-bold">
              <Info className="w-4 h-4" />
              <span>DYNAMIC RISK GRID FORMULA</span>
            </div>
            <div className="bg-navy-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-cyan-electric overflow-x-auto">
              Risk(x,y) = min(1.0, w₁·R_prox + w₂·R_vel + w₃·R_traj + w₄·R_TTC + w₅·R_class + w₆·R_bound)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every cell in the local 60m × 30m grid is continuously updated at 20Hz. High-risk regions (&gt;0.7) act as impenetrable potential barriers for the A* path planner.
            </p>
          </div>

          {/* Component Risk Weight Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Proximity Risk (R_prox)', weight: weights.w_prox, key: 'w_prox', desc: 'Inverse distance Gaussian dropoff around road users' },
              { label: 'Velocity Risk (R_vel)', weight: weights.w_vel, key: 'w_vel', desc: 'Closing approach speed vectors' },
              { label: 'Trajectory Field (R_traj)', weight: weights.w_traj, key: 'w_traj', desc: '1-5s predicted Gaussian probability corridor' },
              { label: 'TTC Severity (R_TTC)', weight: weights.w_ttc, key: 'w_ttc', desc: 'Exponential penalty for TTC < 3.0s' },
              { label: 'Class Unpredictability (R_class)', weight: weights.w_class, key: 'w_class', desc: 'Cattle (1.0), Auto (0.85), Pedestrian (0.9)' },
              { label: 'Boundary Clearance (R_bound)', weight: weights.w_bound, key: 'w_bound', desc: 'Off-road ditch & shoulder penalty' },
            ].map((comp, idx) => (
              <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">{comp.label}</span>
                  <span className="font-mono text-xs text-cyan-electric font-bold">{comp.weight.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-muted-blue">{comp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Weight Tuning Sliders */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-electric" />
            <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
              Interactive Risk Weight Tuning
            </h3>
          </div>

          {Object.entries(weights).map(([key, val]) => (
            <div key={key} className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 uppercase">{key.replace('_', ' ')}</span>
                <span className="text-cyan-electric font-bold">{val.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.5"
                step="0.01"
                value={val}
                onChange={(e) => setWeights({ ...weights, [key]: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-electric"
              />
            </div>
          ))}

          <button
            onClick={() =>
              setWeights({
                w_prox: 0.25,
                w_vel: 0.15,
                w_traj: 0.25,
                w_ttc: 0.20,
                w_class: 0.10,
                w_bound: 0.05,
              })
            }
            className="w-full py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            RESET DEFAULT WEIGHTS
          </button>
        </div>
      </div>
    </div>
  );
};
