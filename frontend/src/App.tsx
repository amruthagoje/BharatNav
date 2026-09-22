import React, { useState, useEffect } from 'react';
import type { ViewMode, SimulationState, ScenarioConfig } from './types/simulation';
import { api } from './services/api';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { OverviewPage } from './pages/OverviewPage';
import { LiveSimulationPage } from './pages/LiveSimulationPage';
import { RiskGridPage } from './pages/RiskGridPage';
import { PerceptionPage } from './pages/PerceptionPage';
import { PredictionPage } from './pages/PredictionPage';
import { PathPlanningPage } from './pages/PathPlanningPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ResearchPage } from './pages/ResearchPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { SettingsPage } from './pages/SettingsPage';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const [scenarios, setScenarios] = useState<ScenarioConfig[]>([]);
  const [simState, setSimState] = useState<SimulationState>(() =>
    api.getClientEngine().getState()
  );

  const [demoActive, setDemoActive] = useState<boolean>(false);
  const [demoPhase, setDemoPhase] = useState<number>(1);

  // Check backend server status on mount
  useEffect(() => {
    const init = async () => {
      const connected = await api.checkBackend();
      setIsBackendConnected(connected);
      const list = await api.getScenarios();
      setScenarios(list);
    };
    init();
  }, []);

  // Main 20Hz tick loop
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(async () => {
        for (let i = 0; i < speedMultiplier; i++) {
          const newState = await api.getSimulationState();
          setSimState(newState);
        }
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, speedMultiplier]);

  const handleTogglePlay = async () => {
    if (isRunning) {
      await api.pauseSimulation();
      setIsRunning(false);
    } else {
      await api.startSimulation();
      setIsRunning(true);
    }
  };

  const handleReset = async () => {
    await api.pauseSimulation();
    setIsRunning(false);
    const resetState = await api.resetSimulation();
    setSimState(resetState);
    setDemoActive(false);
  };

  const handleSelectScenario = async (id: string) => {
    await api.pauseSimulation();
    setIsRunning(false);
    const newState = await api.selectScenario(id);
    setSimState(newState);
  };

  // Guided Interactive Demo Mode Sequence
  const handleStartDemo = async () => {
    setDemoActive(true);
    setDemoPhase(1);
    setCurrentView('simulation');
    await handleSelectScenario('scenario_5'); // Cattle Crossing Scenario
    await api.startSimulation();
    setIsRunning(true);

    // Automated phase narrative progression
    setTimeout(() => setDemoPhase(2), 2000);
    setTimeout(() => setDemoPhase(3), 4000);
    setTimeout(() => setDemoPhase(4), 6000);
    setTimeout(() => setDemoPhase(5), 8500);
  };

  return (
    <div className="flex h-screen w-screen bg-navy-950 text-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        riskLevel={simState.ego.risk_level}
      />

      {/* Main Right Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <TopBar
          state={simState}
          isRunning={isRunning}
          onTogglePlay={handleTogglePlay}
          onReset={handleReset}
          onStartDemo={handleStartDemo}
          isBackendConnected={isBackendConnected}
        />

        {/* Demo Mode Overlay Banner */}
        {demoActive && (
          <div className="bg-gradient-to-r from-saffron via-saffron-dark to-cyan-electric text-navy-950 px-6 py-2 flex items-center justify-between font-mono font-bold text-xs shadow-lg z-30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-navy-950 fill-navy-950 animate-spin" />
              <span>
                BHARATNAV DEMO MODE — PHASE {demoPhase}/5:{' '}
                {demoPhase === 1
                  ? 'Phase 1: Normal Driving'
                  : demoPhase === 2
                  ? 'Phase 2: Unpredictable Auto-Rickshaw Merge'
                  : demoPhase === 3
                  ? 'Phase 3: Sudden Pedestrian Jaywalking'
                  : demoPhase === 4
                  ? 'Phase 4: Sudden Cattle Crossing — Critical TTC'
                  : 'Phase 5: SUCCESSFUL REPLANNING & COLLISION AVOIDANCE'}
              </span>
            </div>
            {demoPhase === 5 && (
              <span className="flex items-center gap-1 text-navy-950 font-black bg-white/30 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% COLLISION FREE
              </span>
            )}
          </div>
        )}

        {/* Page Content Switcher */}
        <main className="flex-1 overflow-hidden relative">
          {currentView === 'overview' && (
            <OverviewPage
              onSelectView={setCurrentView}
              onSelectScenario={handleSelectScenario}
              scenarios={scenarios}
            />
          )}

          {currentView === 'simulation' && (
            <LiveSimulationPage
              state={simState}
              isRunning={isRunning}
              onTogglePlay={handleTogglePlay}
              onReset={handleReset}
              speedMultiplier={speedMultiplier}
              onChangeSpeed={setSpeedMultiplier}
              onManualReplan={() => setSimState({ ...simState })}
            />
          )}

          {currentView === 'risk-grid' && <RiskGridPage state={simState} />}

          {currentView === 'perception' && <PerceptionPage state={simState} />}

          {currentView === 'prediction' && <PredictionPage state={simState} />}

          {currentView === 'path-planning' && (
            <PathPlanningPage state={simState} onManualReplan={() => setSimState({ ...simState })} />
          )}

          {currentView === 'scenarios' && (
            <ScenariosPage
              scenarios={scenarios}
              onSelectScenario={handleSelectScenario}
              onSelectView={setCurrentView}
            />
          )}

          {currentView === 'analytics' && <AnalyticsPage state={simState} />}

          {currentView === 'research' && <ResearchPage />}

          {currentView === 'architecture' && <ArchitecturePage />}

          {currentView === 'settings' && (
            <SettingsPage
              isBackendConnected={isBackendConnected}
              onCheckBackend={async () => {
                const connected = await api.checkBackend();
                setIsBackendConnected(connected);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};
