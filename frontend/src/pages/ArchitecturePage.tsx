import React from 'react';
import { Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const nodes = [
    { title: '1. Sensors', desc: 'Camera / LiDAR / Radar', highlight: 'Multi-Modal Data' },
    { title: '2. Perception', desc: 'Sensor Fusion', highlight: 'Environment Model' },
    { title: '3. Detection & Tracking', desc: 'Kalman Filter Multi-Object', highlight: 'Tracked IDs' },
    { title: '4. Motion Prediction', desc: 'Constant Vel & Turn Rate', highlight: '1-5s Trajectories' },
    { title: '5. Dynamic Risk Grid', desc: '0.0 - 1.0 Continuous Mesh', highlight: 'Risk Heatmap' },
    { title: '6. Decision Engine', desc: 'State Machine + Debounce', highlight: 'REPLAN / BRAKE' },
    { title: '7. Adaptive Planner', desc: 'Risk-Weighted A* Grid', highlight: 'Safe Corridor' },
    { title: '8. Vehicle Controller', desc: 'Pure Pursuit + Kinematics', highlight: 'Steer & Accel' },
  ];

  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-cyan-electric" />
            <h2 className="text-xl font-extrabold text-slate-100">Closed-Loop System Architecture</h2>
          </div>
          <p className="text-xs text-muted-blue font-mono mt-1">
            Sense → Understand → Predict → Assess Risk → Plan → Control → REPLAN
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="grid grid-cols-4 gap-6">
          {nodes.map((node, idx) => (
            <div key={idx} className="relative">
              <div className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-cyan-electric/50 transition-all space-y-2 bg-navy-950/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-100">{node.title}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-safety-green" />
                </div>
                <p className="text-[11px] text-muted-blue font-mono">{node.desc}</p>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-electric/15 text-cyan-electric">
                    {node.highlight}
                  </span>
                </div>
              </div>
              {idx < nodes.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-cyan-electric">
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-cyan-electric/10 border border-cyan-electric/30 flex items-center justify-between text-xs font-mono">
          <span className="text-cyan-electric font-bold">CLOSED LOOP FEEDBACK REPLANNING RATE: 20 Hz (50ms)</span>
          <span className="text-slate-300">Continuous Risk-Aware Self-Correction</span>
        </div>
      </div>
    </div>
  );
};
