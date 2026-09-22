import React from 'react';
import { SimulationState } from '../types/simulation';
import { GitCommit, Compass, Zap, ShieldCheck } from 'lucide-react';

interface PathPlanningPageProps {
  state: SimulationState;
  onManualReplan?: () => void;
}

export const PathPlanningPage: React.FC<PathPlanningPageProps> = ({ state, onManualReplan }) => {
  const { path, ego } = state;

  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <GitCommit className="w-5 h-5 text-cyan-electric" />
          <h2 className="text-xl font-extrabold text-slate-100">Adaptive Path Planning & Control</h2>
        </div>
        <button
          onClick={onManualReplan}
          className="px-4 py-2 rounded-lg bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40 font-bold text-xs hover:bg-cyan-electric/30 transition-all"
        >
          REPLAN TRAJECTORY NOW
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Cost Formula Breakdown */}
        <div className="col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold text-saffron uppercase">
              A* Trajectory Optimization Cost Function
            </h3>
            <div className="bg-navy-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-cyan-electric">
              Cost(node) = Cost(parent) + ΔDistance + α·Risk(node)² + β·|ΔHeading| + γ·ClearancePenalty
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              BharatNav's planner chooses a safer, smoother corridor even if it is slightly longer, guaranteeing optimal clearance from erratic road users.
            </p>
          </div>

          {/* Path Candidates Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-xl border border-cyan-electric/40 space-y-3 bg-cyan-electric/5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-cyan-electric">PRIMARY PATH (SELECTED)</span>
                <span className="text-[10px] font-mono bg-cyan-electric/20 text-cyan-electric px-2 py-0.5 rounded font-bold">
                  OPTIMAL
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-xs text-slate-300">
                <div className="flex justify-between"><span>Risk Score:</span><span className="font-bold text-safety-green">{path.avg_risk}</span></div>
                <div className="flex justify-between"><span>Length:</span><span>{path.path_length}m</span></div>
                <div className="flex justify-between"><span>Smoothness:</span><span>{path.smoothness_score}%</span></div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-slate-400">ALTERNATIVE PATH</span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">STANDBY</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs text-slate-400">
                <div className="flex justify-between"><span>Risk Score:</span><span>{(path.avg_risk + 0.15).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Length:</span><span>{(path.path_length + 2.0).toFixed(1)}m</span></div>
                <div className="flex justify-between"><span>Smoothness:</span><span>88.0%</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pure Pursuit Controller Telemetry */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Compass className="w-4 h-4 text-cyan-electric" />
            <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
              Pure Pursuit Lateral Controller
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-navy-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-muted-blue text-[10px]">Steering Angle Output</span>
              <p className="font-bold text-sm text-slate-100">{(ego.steering_angle * (180 / Math.PI)).toFixed(2)}°</p>
            </div>

            <div className="bg-navy-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-muted-blue text-[10px]">Target Lookahead Distance</span>
              <p className="font-bold text-sm text-cyan-electric">{(Math.max(3.0, 0.5 * ego.v)).toFixed(1)}m</p>
            </div>

            <div className="bg-navy-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-muted-blue text-[10px]">Kinematic Wheelbase</span>
              <p className="font-bold text-sm text-slate-300">2.8m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
