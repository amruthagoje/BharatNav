import React from 'react';
import type { SimulationState } from '../../types/simulation';
import { Play, Pause, RotateCcw, AlertTriangle, ShieldCheck, Sparkles, Activity, Gauge, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TopBarProps {
  state: SimulationState;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onStartDemo: () => void;
  isBackendConnected: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  state,
  isRunning,
  onTogglePlay,
  onReset,
  onStartDemo,
  isBackendConnected,
}) => {
  const { ego, scenario, decision } = state;
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-navy-950/95 border-b border-slate-800/80 px-6 flex items-center justify-between select-none z-20">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-100">{scenario.name}</h2>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              AV-01 (Ego)
            </span>
          </div>
          <p className="text-[11px] text-muted-blue font-mono">
            {scenario.road_width}m Road | Mode:{' '}
            <span className={isBackendConnected ? 'text-safety-green font-semibold' : 'text-cyan-electric font-semibold'}>
              {isBackendConnected ? 'FASTAPI BACKEND' : 'LOCAL SIM ENGINE'}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Gauge className="w-4 h-4 text-cyan-electric" />
          <div>
            <p className="text-[9px] font-mono text-muted-blue uppercase">Speed</p>
            <p className="text-sm font-mono font-bold text-slate-100">
              {ego.v_kmh} <span className="text-[10px] font-normal text-slate-400">km/h</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Activity className="w-4 h-4 text-saffron" />
          <div>
            <p className="text-[9px] font-mono text-muted-blue uppercase">Min TTC</p>
            <p className="text-sm font-mono font-bold text-slate-100">
              {ego.ttc_min > 90 ? '∞' : `${ego.ttc_min}s`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
          {decision === 'EMERGENCY_BRAKE' ? (
            <AlertTriangle className="w-4 h-4 text-danger-red animate-pulse" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-safety-green" />
          )}
          <div>
            <p className="text-[9px] font-mono text-muted-blue uppercase">Decision</p>
            <p
              className={`text-xs font-mono font-extrabold ${
                decision === 'EMERGENCY_BRAKE'
                  ? 'text-danger-red'
                  : decision === 'REPLAN'
                  ? 'text-warning-amber'
                  : 'text-safety-green'
              }`}
            >
              {decision}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
            isRunning
              ? 'bg-warning-amber/20 text-warning-amber border border-warning-amber/40 hover:bg-warning-amber/30'
              : 'bg-safety-green/20 text-safety-green border border-safety-green/40 hover:bg-safety-green/30'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'PAUSE' : 'RUN SIM'}</span>
        </button>

        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset Simulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center"
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-warning-amber" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-cyan-electric" />
          )}
        </button>

        <button
          onClick={onStartDemo}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-saffron via-saffron-dark to-cyan-electric text-navy-950 font-black text-xs shadow-lg shadow-saffron/20 hover:brightness-110 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-navy-950 fill-navy-950" />
          <span>START DEMO</span>
        </button>
      </div>
    </header>
  );
};

