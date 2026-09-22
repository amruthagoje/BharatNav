import React, { useRef, useEffect } from 'react';
import { SimulationState } from '../types/simulation';
import { Eye, Camera, Radio, Disc } from 'lucide-react';

interface PerceptionPageProps {
  state: SimulationState;
}

export const PerceptionPage: React.FC<PerceptionPageProps> = ({ state }) => {
  const lidarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render LiDAR 3D-style Point Cloud Canvas
  useEffect(() => {
    const canvas = lidarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.fillStyle = '#030810';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Concentric Range Rings
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.15)';
    ctx.lineWidth = 1;
    [30, 70, 110, 150].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.stroke();
    });

    // Ego vehicle marker at center
    ctx.fillStyle = '#00D9FF';
    ctx.fillRect(cx - 5, cy - 8, 10, 16);

    // Simulated LiDAR Point Cloud points around objects
    state.objects.forEach((obj) => {
      const dx = (obj.x - state.ego.x) * 4.0;
      const dy = (obj.y - state.ego.y) * 4.0;

      ctx.fillStyle = '#27E38A';
      for (let i = 0; i < 40; i++) {
        const px = cx + dx + (Math.random() - 0.5) * obj.length * 4;
        const py = cy + dy + (Math.random() - 0.5) * obj.width * 4;
        ctx.fillRect(px, py, 2, 2);
      }
    });
  }, [state]);

  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Eye className="w-5 h-5 text-cyan-electric" />
          <h2 className="text-xl font-extrabold text-slate-100">Multi-Modal Perception Feed</h2>
        </div>
        <span className="text-xs font-mono bg-cyan-electric/20 text-cyan-electric px-3 py-1 rounded border border-cyan-electric/30 font-bold">
          SENSOR FUSION: ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Camera Feed Visualizer */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Camera className="w-4 h-4 text-saffron" />
              <span>Forward Stereo Camera Feed</span>
            </div>
            <span className="text-[10px] font-mono text-safety-green font-bold">30 FPS</span>
          </div>

          <div className="relative h-60 rounded-lg bg-navy-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Simulated Road Horizon */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 opacity-90"></div>
            <div className="absolute bottom-0 w-full h-1/2 bg-slate-800/40 border-t border-slate-700/50"></div>

            {/* Render Bounding Boxes for Objects in Camera View */}
            {state.objects.map((obj) => (
              <div
                key={obj.id}
                className="absolute border-2 border-saffron bg-saffron/10 p-1 text-[9px] font-mono text-saffron font-bold rounded"
                style={{
                  left: `${Math.max(10, Math.min(80, 50 + (obj.y * 5)))}%`,
                  top: `${Math.max(20, Math.min(70, 60 - ((obj.x - state.ego.x) * 1.5)))}%`,
                  width: `${Math.max(30, 80 - (obj.x - state.ego.x)) }px`,
                  height: `${Math.max(30, 80 - (obj.x - state.ego.x)) }px`,
                }}
              >
                {obj.object_class} ({(obj.confidence * 100).toFixed(0)}%)
              </div>
            ))}
          </div>
        </div>

        {/* LiDAR 3D Point Cloud Canvas */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Disc className="w-4 h-4 text-safety-green" />
              <span>LiDAR Point Cloud (128-Beam)</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-electric font-bold">1.2M Pts/s</span>
          </div>

          <div className="h-60 rounded-lg bg-navy-950 border border-slate-800 overflow-hidden">
            <canvas ref={lidarCanvasRef} className="w-full h-full block" />
          </div>
        </div>

        {/* Radar Doppler Vectors */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Radio className="w-4 h-4 text-cyan-electric" />
              <span>77GHz mmWave Radar Array</span>
            </div>
            <span className="text-[10px] font-mono text-saffron font-bold">Range: 200m</span>
          </div>

          <div className="h-60 rounded-lg bg-navy-950 border border-slate-800 p-4 space-y-2 overflow-y-auto font-mono text-xs">
            {state.objects.map((obj) => (
              <div key={obj.id} className="p-2 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-slate-200 font-bold">{obj.id}</span>
                  <p className="text-[10px] text-muted-blue">Range: {Math.hypot(obj.x - state.ego.x, obj.y - state.ego.y).toFixed(1)}m</p>
                </div>
                <div className="text-right">
                  <span className="text-saffron font-bold">{(obj.vx * 3.6).toFixed(1)} km/h</span>
                  <p className="text-[10px] text-slate-400">Doppler Vector</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
