import React from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface TimelineControlsProps {
  timestamp: number;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  speedMultiplier: number;
  onChangeSpeed: (speed: number) => void;
  completionPct: number;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  timestamp,
  isRunning,
  onTogglePlay,
  onReset,
  speedMultiplier,
  onChangeSpeed,
  completionPct,
}) => {
  return (
    <div className="h-12 bg-navy-950/90 border-t border-slate-800/80 px-6 flex items-center justify-between z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onTogglePlay}
          className="text-slate-300 hover:text-cyan-electric transition-colors"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={onReset} className="text-slate-400 hover:text-slate-200 transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
        <span className="font-mono text-xs text-slate-300 font-bold">
          T = {timestamp.toFixed(2)}s
        </span>
      </div>

      {/* Timeline Progress Bar */}
      <div className="flex-1 mx-8 max-w-2xl flex items-center gap-3">
        <span className="text-[10px] font-mono text-muted-blue">0.0s</span>
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-saffron to-cyan-electric rounded-full transition-all duration-75"
            style={{ width: `${Math.min(100, completionPct)}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-muted-blue">{completionPct}%</span>
      </div>

      {/* Speed Multiplier Options */}
      <div className="flex items-center gap-2">
        <FastForward className="w-3.5 h-3.5 text-muted-blue" />
        {[1, 2, 5].map((speed) => (
          <button
            key={speed}
            onClick={() => onChangeSpeed(speed)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
              speedMultiplier === speed
                ? 'bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
};
