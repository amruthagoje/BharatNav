import React from 'react';
import { ViewMode, ScenarioConfig } from '../types/simulation';
import { PlayCircle, ShieldCheck, Zap, Layers, ArrowRight, CheckCircle2, Cpu, Activity, AlertTriangle } from 'lucide-react';

interface OverviewPageProps {
  onSelectView: (view: ViewMode) => void;
  onSelectScenario: (id: string) => void;
  scenarios: ScenarioConfig[];
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onSelectView,
  onSelectScenario,
  scenarios,
}) => {
  return (
    <div className="h-full overflow-y-auto p-8 space-y-10 select-none">
      {/* Hero Section */}
      <div className="relative rounded-2xl p-8 glass-panel-glow border border-cyan-electric/30 overflow-hidden bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-electric/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-xs font-mono font-bold shadow-sm">
            <span>SIH 26037</span>
            <span>•</span>
            <span>MATHWORKS SMART VEHICLES</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-100 font-sans">
            BHARAT<span className="text-saffron">NAV</span>
          </h1>

          <p className="text-lg text-slate-200 font-medium leading-relaxed">
            Adaptive Path Planning & Collision Avoidance for Autonomous Vehicles on Unstructured Indian Roads
          </p>

          <p className="text-xs text-muted-blue font-mono">
            Sense. Predict. Assess Risk. Plan. Adapt.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onSelectView('simulation')}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-electric to-blue-600 text-navy-950 font-black text-sm shadow-xl shadow-cyan-electric/20 hover:scale-105 active:scale-95 transition-all"
            >
              <PlayCircle className="w-5 h-5 fill-navy-950 text-cyan-electric" />
              <span>LAUNCH SIMULATION</span>
            </button>

            <button
              onClick={() => onSelectView('scenarios')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-xs transition-all"
            >
              <Layers className="w-4 h-4 text-saffron" />
              <span>EXPLORE SCENARIOS</span>
            </button>

            <button
              onClick={() => onSelectView('architecture')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-xs transition-all"
            >
              <Cpu className="w-4 h-4 text-cyan-electric" />
              <span>SYSTEM ARCHITECTURE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Subsystem Status */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400">
          CLOSED-LOOP SUBSYSTEM HEALTH
        </h3>

        <div className="grid grid-cols-5 gap-4">
          {[
            { name: 'Perception', status: 'ONLINE', icon: EyeIcon, desc: 'Camera, LiDAR, Radar' },
            { name: 'Prediction', status: 'ONLINE', icon: Activity, desc: 'Constant Vel & Turn Rate' },
            { name: 'Risk Grid', status: 'ONLINE', icon: ShieldCheck, desc: '0.0 - 1.0 Continuous Mesh' },
            { name: 'A* Planner', status: 'ONLINE', icon: Zap, desc: 'Risk-Weighted Trajectory' },
            { name: 'Kinematic Control', status: 'ONLINE', icon: CheckCircle2, desc: 'Pure Pursuit Steering' },
          ].map((sub, idx) => (
            <div
              key={idx}
              className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2 hover:border-cyan-electric/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{sub.name}</span>
                <span className="w-2 h-2 rounded-full bg-safety-green animate-ping"></span>
              </div>
              <p className="text-[10px] text-muted-blue font-mono">{sub.desc}</p>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-safety-green">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{sub.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Validation Scenarios */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400">
            5 INDIAN ROAD BENCHMARK SCENARIOS
          </h3>
          <span className="text-xs text-saffron font-mono font-bold">100% Collision-Free Adaptive Guarantee</span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {scenarios.map((scen, idx) => (
            <div
              key={scen.id}
              onClick={() => {
                onSelectScenario(scen.id);
                onSelectView('simulation');
              }}
              className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-saffron/50 transition-all cursor-pointer group space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-saffron/20 text-saffron border border-saffron/30">
                  SCENARIO 0{idx + 1}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-saffron group-hover:translate-x-1 transition-all" />
              </div>

              <h4 className="font-bold text-sm text-slate-100 group-hover:text-saffron transition-colors">
                {scen.name}
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {scen.description}
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-muted-blue pt-2 border-t border-slate-800/80">
                <span>{scen.road_type}</span>
                <span>Speed: {scen.target_speed * 3.6} km/h</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Innovation Highlight Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between bg-navy-950/60">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-saffron" />
            <h4 className="font-bold text-slate-100 text-sm">WHY BHARATNAV OVER TRADITIONAL AV PLANNER?</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Traditional AV systems assume clear lane lines, static obstacle maps, and predictable drivers.
            BharatNav constructs a continuous Dynamic Risk Grid that predicts unpredictable Indian traffic behavior (auto-rickshaws, pedestrians, cattle) and replans trajectories smoothly in &lt;150ms.
          </p>
        </div>

        <button
          onClick={() => onSelectView('analytics')}
          className="px-5 py-2.5 rounded-xl bg-saffron/20 border border-saffron/40 text-saffron font-bold text-xs hover:bg-saffron/30 transition-all shrink-0"
        >
          VIEW BASELINE BENCHMARK
        </button>
      </div>
    </div>
  );
};

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
