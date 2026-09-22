import type { SimulationState, ScenarioConfig } from '../types/simulation';
import { ClientSimulationEngine } from '../simulation/clientEngine';

const API_BASE = '/api';

export class ApiService {
  private clientEngine: ClientSimulationEngine;
  public useBackend: boolean = false;

  constructor() {
    this.clientEngine = new ClientSimulationEngine('scenario_1');
  }

  public getClientEngine(): ClientSimulationEngine {
    return this.clientEngine;
  }

  public async checkBackend(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/system/status`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        this.useBackend = true;
        return true;
      }
    } catch (e) {
      this.useBackend = false;
    }
    return false;
  }

  public async getScenarios(): Promise<ScenarioConfig[]> {
    if (this.useBackend) {
      try {
        const res = await fetch(`${API_BASE}/scenarios`);
        if (res.ok) return await res.json();
      } catch (e) {
        this.useBackend = false;
      }
    }
    return [
      {
        id: 'scenario_1',
        name: 'Unmarked Village Road',
        description: 'Narrow unstriped village road with oncoming motorcycle, walking cattle, and erratic auto-rickshaw.',
        road_type: 'Unmarked Village Road',
        road_width: 7.0,
        road_length: 120.0,
        ego_start_speed: 8.0,
        target_speed: 10.0,
        weather: 'Clear',
        time_of_day: 'Day',
        agents: []
      },
      {
        id: 'scenario_2',
        name: 'Busy Unsignalized Urban Intersection',
        description: 'Complex 4-way unsignalized junction with multi-directional cross traffic and pedestrians.',
        road_type: 'Urban Intersection',
        road_width: 10.0,
        road_length: 100.0,
        ego_start_speed: 8.3,
        target_speed: 11.0,
        weather: 'Clear',
        time_of_day: 'Day',
        agents: []
      },
      {
        id: 'scenario_3',
        name: 'Highway Merge',
        description: 'AV merging into high-speed traffic stream with heavy trucks and fast overtaking vehicles.',
        road_type: 'Highway Ramp',
        road_width: 12.0,
        road_length: 150.0,
        ego_start_speed: 15.0,
        target_speed: 20.0,
        weather: 'Clear',
        time_of_day: 'Day',
        agents: []
      },
      {
        id: 'scenario_4',
        name: 'Dense Market Area',
        description: 'Slow micro-navigation through dense market with pushcarts, pedestrians, and double-parked autos.',
        road_type: 'Market Street',
        road_width: 6.5,
        road_length: 80.0,
        ego_start_speed: 5.0,
        target_speed: 6.0,
        weather: 'Clear',
        time_of_day: 'Day',
        agents: []
      },
      {
        id: 'scenario_5',
        name: 'Sudden Cattle Crossing',
        description: 'Cruising vehicle encounters sudden cattle stepping into road at close range, triggering emergency replan.',
        road_type: 'Suburban Highway',
        road_width: 8.0,
        road_length: 120.0,
        ego_start_speed: 11.11,
        target_speed: 11.11,
        weather: 'Clear',
        time_of_day: 'Day',
        agents: []
      }
    ];
  }

  public async selectScenario(id: string): Promise<SimulationState> {
    this.clientEngine.setScenario(id);
    if (this.useBackend) {
      try {
        const res = await fetch(`${API_BASE}/simulation/select-scenario/${id}`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          return data.state;
        }
      } catch (e) {
        this.useBackend = false;
      }
    }
    return this.clientEngine.getState();
  }

  public async startSimulation(): Promise<void> {
    this.clientEngine.isRunning = true;
    if (this.useBackend) {
      try {
        await fetch(`${API_BASE}/simulation/start`, { method: 'POST' });
      } catch (e) {
        this.useBackend = false;
      }
    }
  }

  public async pauseSimulation(): Promise<void> {
    this.clientEngine.isRunning = false;
    if (this.useBackend) {
      try {
        await fetch(`${API_BASE}/simulation/pause`, { method: 'POST' });
      } catch (e) {
        this.useBackend = false;
      }
    }
  }

  public async resetSimulation(): Promise<SimulationState> {
    this.clientEngine.reset();
    if (this.useBackend) {
      try {
        const res = await fetch(`${API_BASE}/simulation/reset`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          return data.state;
        }
      } catch (e) {
        this.useBackend = false;
      }
    }
    return this.clientEngine.getState();
  }

  public async getSimulationState(): Promise<SimulationState> {
    if (this.useBackend) {
      try {
        const res = await fetch(`${API_BASE}/simulation/state`);
        if (res.ok) return await res.json();
      } catch (e) {
        this.useBackend = false;
      }
    }
    if (this.clientEngine.isRunning) {
      return this.clientEngine.step();
    }
    return this.clientEngine.getState();
  }
}

export const api = new ApiService();
