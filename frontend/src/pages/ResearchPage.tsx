import React from 'react';
import { BookOpen, ExternalLink, Cpu, FileText } from 'lucide-react';

export const ResearchPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-saffron" />
            <h2 className="text-xl font-extrabold text-slate-100">Research Basis & MathWorks Integration</h2>
          </div>
          <p className="text-xs text-muted-blue font-mono mt-1">
            Grounded in India Driving Dataset (IDD) & Autonomous Motion Planning Literature
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Research Papers & Datasets */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-saffron uppercase font-mono flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Dataset & Research Foundations</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-navy-950 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-slate-100">India Driving Dataset (IDD)</span>
              <p className="text-[11px] text-muted-blue">
                Provides unstructured traffic annotations for heterogenous vehicles (auto-rickshaws, pushcarts, cattle) on unstriped Indian roads.
              </p>
            </div>

            <div className="p-3 bg-navy-950 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-slate-100">Dynamic Occupancy & Risk Grids</span>
              <p className="text-[11px] text-muted-blue">
                Continuous risk field integration extending classical Occupancy Grids with Time-To-Collision (TTC) and relative velocity vectors.
              </p>
            </div>

            <div className="p-3 bg-navy-950 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-slate-100">Risk-Weighted Hybrid A* Planning</span>
              <p className="text-[11px] text-muted-blue">
                Curvature-constrained trajectory optimization selecting safer corridors despite length trade-offs.
              </p>
            </div>
          </div>
        </div>

        {/* MathWorks RoadRunner / Simulink Integration */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-cyan-electric uppercase font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>MathWorks RoadRunner / Simulink Co-Simulation</span>
          </h3>

          <div className="bg-navy-950 p-4 rounded-lg border border-slate-800 space-y-2 font-mono text-xs">
            <p className="text-slate-200 font-bold">Bridge Architecture:</p>
            <p className="text-cyan-electric text-[11px]">
              BharatNav Python Engine ◄──[gRPC / UDP Socket]──► MathWorks RoadRunner Scenario API
            </p>
            <p className="text-muted-blue text-[10px] leading-relaxed pt-2">
              The `SimulationAdapter` module provides seamless socket hooks. Vehicle dynamics and perception streams can be mirrored into MATLAB / Simulink HIL (Hardware-in-the-Loop) environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
