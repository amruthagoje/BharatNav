import React from 'react';
import { Settings, RefreshCw, Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface SettingsPageProps {
  isBackendConnected: boolean;
  onCheckBackend: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isBackendConnected,
  onCheckBackend,
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themeOptions: { mode: ThemeMode; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
    {
      mode: 'light',
      label: 'Light Mode',
      icon: Sun,
      description: 'Clean, high-contrast crisp theme for bright environments',
    },
    {
      mode: 'dark',
      label: 'Dark Mode',
      icon: Moon,
      description: 'Futuristic midnight navy theme for low-light viewing',
    },
    {
      mode: 'system',
      label: 'System Preference',
      icon: Laptop,
      description: 'Automatically synchronizes with your device settings',
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-slate-300" />
            <h2 className="text-xl font-extrabold text-slate-100">System Settings & Customization</h2>
          </div>
          <p className="text-xs text-muted-blue font-mono mt-1">
            Configure UI themes, platform parameters, backend server connection, and simulation adapters
          </p>
        </div>
      </div>

      {/* Theme Selection Section */}
      <div className="space-y-4 max-w-4xl">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider font-mono">
          APPEARANCE & THEME PREFERENCE
        </h3>

        <div className="grid grid-cols-3 gap-5">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.mode;
            return (
              <div
                key={opt.mode}
                onClick={() => setTheme(opt.mode)}
                className={`glass-panel p-5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-cyan-electric ring-1 ring-cyan-electric/50 shadow-lg shadow-cyan-electric/10 bg-cyan-electric/5'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <Icon
                      className={`w-5 h-5 ${
                        opt.mode === 'light'
                          ? 'text-warning-amber'
                          : opt.mode === 'dark'
                          ? 'text-cyan-electric'
                          : 'text-saffron'
                      }`}
                    />
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold bg-cyan-electric/20 text-cyan-electric px-2 py-0.5 rounded border border-cyan-electric/30">
                      <Check className="w-3 h-3" /> ACTIVE
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-100">{opt.label}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{opt.description}</p>
                </div>

                {opt.mode === 'system' && (
                  <span className="text-[10px] font-mono text-muted-blue italic">
                    Currently resolved to: <strong className="uppercase text-slate-200">{resolvedTheme}</strong>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-4xl">
        <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-xs text-slate-200 uppercase font-mono">Backend Engine Connection</h3>

          <div className="p-4 rounded-lg bg-navy-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs font-bold text-slate-100">FastAPI Backend Status</p>
              <p className="text-[10px] text-muted-blue">http://127.0.0.1:8000/api</p>
            </div>
            <span
              className={`font-mono text-xs font-bold px-2.5 py-1 rounded ${
                isBackendConnected
                  ? 'bg-safety-green/20 text-safety-green border border-safety-green/40'
                  : 'bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40'
              }`}
            >
              {isBackendConnected ? 'CONNECTED' : 'STANDALONE (CLIENT ENGINE)'}
            </span>
          </div>

          <button
            onClick={onCheckBackend}
            className="w-full py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RE-CHECK FASTAPI SERVER CONNECTION</span>
          </button>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-xs text-slate-200 uppercase font-mono">Safety & TTC Thresholds</h3>

          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Critical Emergency TTC Threshold:</span>
              <span className="font-bold text-danger-red">1.5s</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Caution Speed Reduction Threshold:</span>
              <span className="font-bold text-warning-amber">4.0s</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Max Deceleration Limit:</span>
              <span className="font-bold text-slate-100">-6.0 m/s²</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
