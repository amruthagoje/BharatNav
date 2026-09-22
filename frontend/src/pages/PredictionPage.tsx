import React from 'react';
import { SimulationState } from '../types/simulation';
import { TrendingUp, UserCheck, AlertCircle } from 'lucide-react';

interface PredictionPageProps {
  state: SimulationState;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({ state }) => {
  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="w-5 h-5 text-cyan-electric" />
          <h2 className="text-xl font-extrabold text-slate-100">Motion Prediction & Tracking Engine</h2>
        </div>
        <span className="text-xs font-mono text-saffron font-bold">HORIZON: 3.0 SECONDS</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Tracked Objects List */}
        <div className="col-span-2 space-y-4">
          <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400">
            ACTIVE KALMAN FILTER TRACKS ({state.objects.length})
          </h3>

          <div className="space-y-3">
            {state.objects.map((obj) => (
              <div key={obj.id} className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-saffron/20 border border-saffron/40 flex items-center justify-center font-mono font-black text-saffron">
                    {obj.id.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-100">{obj.id}</h4>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {obj.object_class}
                      </span>
                    </div>
                    <p className="text-xs text-muted-blue font-mono">
                      Pos: ({obj.x.toFixed(1)}m, {obj.y.toFixed(1)}m) | Speed: {(Math.hypot(obj.vx, obj.vy) * 3.6).toFixed(1)} km/h
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Behavior Profile</span>
                    <p className="font-mono font-bold text-xs text-saffron">{obj.behavior}</p>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">TTC</span>
                    <p className="font-mono font-bold text-xs text-slate-100">{obj.ttc > 90 ? 'SAFE' : `${obj.ttc}s`}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Behavior Profile Breakdown */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <UserCheck className="w-4 h-4 text-saffron" />
            <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
              Indian Driver Behavior Profiles
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { title: 'Auto-rickshaw', desc: 'Frequent lateral swerving, sudden curb stops', profile: 'ERRATIC' },
              { title: 'Pedestrian', desc: 'Unsignaled jaywalking, abrupt direction shifts', profile: 'UNPREDICTABLE' },
              { title: 'Cattle / Animal', desc: 'Slow lateral drift, ignores vehicle honking', profile: 'UNPREDICTABLE' },
              { title: 'Motorcycle', desc: 'Zig-zag lane weaving, close overtaking', profile: 'AGGRESSIVE' },
            ].map((prof, idx) => (
              <div key={idx} className="p-3 bg-navy-950 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-200">{prof.title}</span>
                  <span className="text-saffron font-mono text-[10px]">{prof.profile}</span>
                </div>
                <p className="text-[10px] text-muted-blue">{prof.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
