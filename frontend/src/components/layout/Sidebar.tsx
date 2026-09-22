import React from 'react';
import type { ViewMode } from '../../types/simulation';
import {
  LayoutDashboard,
  PlayCircle,
  Grid3X3,
  Eye,
  TrendingUp,
  GitCommit,
  Layers,
  BarChart3,
  BookOpen,
  Settings,
  ShieldAlert,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  riskLevel: string;
}

const navItems: { id: ViewMode; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'simulation', label: 'Live Simulation', icon: PlayCircle, badge: 'LIVE' },
  { id: 'risk-grid', label: 'Dynamic Risk Grid', icon: Grid3X3 },
  { id: 'perception', label: 'Perception Feed', icon: Eye },
  { id: 'prediction', label: 'Motion Prediction', icon: TrendingUp },
  { id: 'path-planning', label: 'Path Planning', icon: GitCommit },
  { id: 'scenarios', label: 'Scenarios & Builder', icon: Layers, badge: '5' },
  { id: 'analytics', label: 'Analytics & Baseline', icon: BarChart3 },
  { id: 'research', label: 'Research & Standards', icon: BookOpen },
  { id: 'architecture', label: 'System Architecture', icon: Cpu },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView, riskLevel }) => {
  return (
    <aside className="w-64 h-screen bg-navy-950/90 border-r border-slate-800/80 flex flex-col justify-between select-none z-30">
      <div>
        <div className="p-4 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-saffron to-cyan-electric p-0.5 flex items-center justify-center shadow-lg shadow-saffron/10">
            <div className="w-full h-full bg-navy-950 rounded-[7px] flex items-center justify-center">
              <span className="font-extrabold text-saffron text-sm tracking-wider">NAV</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-slate-100 text-lg tracking-wider">BHARATNAV</h1>
              <span className="text-[10px] bg-saffron/20 text-saffron font-bold px-1.5 py-0.5 rounded border border-saffron/30">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-muted-blue font-medium tracking-tight">Adaptive AV Path Planner</p>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-slate-800/50 bg-navy-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safety-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-safety-green"></span>
            </span>
            <span className="text-xs font-mono text-slate-300 font-semibold">SYSTEM ONLINE</span>
          </div>
          <span
            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
              riskLevel === 'CRITICAL'
                ? 'bg-danger-red/20 text-danger-red border border-danger-red/40 animate-pulse'
                : riskLevel === 'HIGH'
                ? 'bg-warning-amber/20 text-warning-amber border border-warning-amber/40'
                : 'bg-safety-green/20 text-safety-green border border-safety-green/40'
            }`}
          >
            {riskLevel}
          </span>
        </div>

        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-electric/20 to-transparent text-cyan-electric border-l-2 border-cyan-electric font-semibold shadow-sm shadow-cyan-electric/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-electric' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      item.badge === 'LIVE'
                        ? 'bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800/80 bg-navy-950">
        <div className="rounded-lg p-2.5 bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-saffron" />
            <div>
              <p className="text-[10px] font-bold text-slate-200">SIH 26037</p>
              <p className="text-[9px] text-muted-blue">MathWorks Smart Vehicles</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-saffron"></div>
        </div>
      </div>
    </aside>
  );
};
