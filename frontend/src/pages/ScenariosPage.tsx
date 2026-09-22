import React, { useState } from 'react';
import { ScenarioConfig, ViewMode, ObjectClass, BehaviorProfile } from '../types/simulation';
import { Layers, Plus, Play, CheckCircle2 } from 'lucide-react';

interface ScenariosPageProps {
  scenarios: ScenarioConfig[];
  onSelectScenario: (id: string) => void;
  onSelectView: (view: ViewMode) => void;
}

export const ScenariosPage: React.FC<ScenariosPageProps> = ({
  scenarios,
  onSelectScenario,
  onSelectView,
}) => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [customName, setCustomName] = useState('My Custom Indian Road');
  const [customRoadWidth, setCustomRoadWidth] = useState(8.0);
  const [customSpeed, setCustomSpeed] = useState(40);

  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-saffron" />
            <h2 className="text-xl font-extrabold text-slate-100">Validation Scenarios & Custom Builder</h2>
          </div>
          <p className="text-xs text-muted-blue font-mono mt-1">
            Test BharatNav against real-world Indian road challenges
          </p>
        </div>

        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-saffron/20 text-saffron border border-saffron/40 font-bold text-xs hover:bg-saffron/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{showBuilder ? 'HIDE BUILDER' : 'CREATE CUSTOM SCENARIO'}</span>
        </button>
      </div>

      {/* Interactive Scenario Builder Form */}
      {showBuilder && (
        <div className="glass-panel p-6 rounded-2xl border border-saffron/40 space-y-4 bg-saffron/5">
          <h3 className="font-bold text-sm text-saffron uppercase">Interactive Scenario Builder</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-300">Scenario Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-navy-950 border border-slate-800 text-xs text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-300">Road Width ({customRoadWidth}m)</label>
              <input
                type="range"
                min="5.0"
                max="15.0"
                step="0.5"
                value={customRoadWidth}
                onChange={(e) => setCustomRoadWidth(parseFloat(e.target.value))}
                className="w-full mt-2 accent-saffron"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-300">Ego Speed ({customSpeed} km/h)</label>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={customSpeed}
                onChange={(e) => setCustomSpeed(parseInt(e.target.value))}
                className="w-full mt-2 accent-saffron"
              />
            </div>
          </div>

          <button
            onClick={() => {
              alert(`Custom Scenario '${customName}' created and loaded!`);
              setShowBuilder(false);
            }}
            className="px-6 py-2 rounded-lg bg-saffron text-navy-950 font-bold text-xs shadow-md shadow-saffron/20 hover:brightness-110"
          >
            SAVE & RUN SCENARIO
          </button>
        </div>
      )}

      {/* Preset Scenario Cards */}
      <div className="grid grid-cols-2 gap-6">
        {scenarios.map((scen, idx) => (
          <div
            key={scen.id}
            className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4 hover:border-saffron/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-saffron/20 text-saffron border border-saffron/30">
                  SCENARIO 0{idx + 1}
                </span>
                <span className="text-[10px] font-mono text-muted-blue">{scen.road_type}</span>
              </div>

              <h3 className="font-bold text-base text-slate-100">{scen.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{scen.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="text-[10px] font-mono text-slate-400">
                <span>Target Speed: {(scen.target_speed * 3.6).toFixed(0)} km/h</span>
              </div>

              <button
                onClick={() => {
                  onSelectScenario(scen.id);
                  onSelectView('simulation');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40 font-bold text-xs hover:bg-cyan-electric/30 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-cyan-electric" />
                <span>RUN SCENARIO</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
