import React, { useRef, useEffect } from 'react';
import type { SimulationState, TrackedObject } from '../../types/simulation';
import { useTheme } from '../../context/ThemeContext';

interface SimulationCanvasProps {
  state: SimulationState;
  showRiskGridOverlay?: boolean;
  showBaselinePath?: boolean;
  showTrajectories?: boolean;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  state,
  showRiskGridOverlay = true,
  showBaselinePath = true,
  showTrajectories = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isLight = resolvedTheme === 'light';

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const scale = 14;
    const originX = 120;
    const originY = height / 2;

    const toScreenX = (wx: number) => originX + (wx - state.ego.x + 10) * scale;
    const toScreenY = (wy: number) => originY + wy * scale;

    // Background Canvas Fill
    ctx.fillStyle = isLight ? '#F1F5F9' : '#07111F';
    ctx.fillRect(0, 0, width, height);

    // Canvas Grid Lines
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const roadWidthMeters = state.scenario.road_width;
    const roadTopY = toScreenY(-roadWidthMeters / 2);
    const roadBottomY = toScreenY(roadWidthMeters / 2);
    const roadHeightPx = roadBottomY - roadTopY;

    // Road Surface
    ctx.fillStyle = isLight ? '#E2E8F0' : '#0F1E33';
    ctx.fillRect(0, roadTopY, width, roadHeightPx);

    // Road Borders
    ctx.strokeStyle = isLight ? '#94A3B8' : '#334E68';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, roadTopY);
    ctx.lineTo(width, roadTopY);
    ctx.moveTo(0, roadBottomY);
    ctx.lineTo(width, roadBottomY);
    ctx.stroke();

    // Center Line
    ctx.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.6)' : 'rgba(255, 200, 87, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 15]);
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (showRiskGridOverlay) {
      for (let wx = state.ego.x - 5; wx <= state.ego.x + 45; wx += 1.5) {
        for (let wy = -roadWidthMeters / 2 - 2; wy <= roadWidthMeters / 2 + 2; wy += 1.5) {
          const sx = toScreenX(wx);
          const sy = toScreenY(wy);

          let maxCellRisk = 0;
          state.objects.forEach((obj) => {
            const dist = Math.hypot(obj.x - wx, obj.y - wy);
            if (dist < 5.0) {
              const r = Math.exp(-(dist ** 2) / 8.0);
              if (r > maxCellRisk) maxCellRisk = r;
            }
          });

          if (maxCellRisk > 0.05) {
            ctx.fillStyle =
              maxCellRisk > 0.6
                ? `rgba(255, 77, 90, ${maxCellRisk * 0.4})`
                : maxCellRisk > 0.3
                ? `rgba(255, 200, 87, ${maxCellRisk * 0.3})`
                : `rgba(0, 217, 255, ${maxCellRisk * 0.25})`;
            ctx.fillRect(sx - 10, sy - 10, 20, 20);
          }
        }
      }
    }

    if (showBaselinePath && state.baseline_path?.primary_path) {
      ctx.strokeStyle = isLight ? 'rgba(71, 85, 105, 0.5)' : 'rgba(130, 154, 177, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      state.baseline_path.primary_path.forEach((pt, idx) => {
        const sx = toScreenX(pt.x);
        const sy = toScreenY(pt.y);
        if (idx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (state.path?.primary_path && state.path.primary_path.length > 0) {
      const pathColor = state.decision === 'EMERGENCY_BRAKE' ? '#FF4D5A' : (isLight ? '#0284C7' : '#00D9FF');
      ctx.strokeStyle = pathColor;
      ctx.lineWidth = 4;
      ctx.shadowColor = pathColor;
      ctx.shadowBlur = isLight ? 4 : 10;
      ctx.beginPath();
      state.path.primary_path.forEach((pt, idx) => {
        const sx = toScreenX(pt.x);
        const sy = toScreenY(pt.y);
        if (idx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    state.objects.forEach((obj: TrackedObject) => {
      const osx = toScreenX(obj.x);
      const osy = toScreenY(obj.y);

      if (showTrajectories && obj.predicted_trajectory) {
        ctx.strokeStyle = 'rgba(255, 153, 51, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(osx, osy);
        obj.predicted_trajectory.forEach((pt) => {
          ctx.lineTo(toScreenX(pt.x), toScreenY(pt.y));
        });
        ctx.stroke();
        ctx.setLineDash([]);

        if (obj.predicted_trajectory.length > 0) {
          const lastPt = obj.predicted_trajectory[obj.predicted_trajectory.length - 1];
          const eX = toScreenX(lastPt.x);
          const eY = toScreenY(lastPt.y);
          ctx.fillStyle = 'rgba(255, 153, 51, 0.15)';
          ctx.strokeStyle = 'rgba(255, 153, 51, 0.5)';
          ctx.beginPath();
          ctx.arc(eX, eY, lastPt.sigma * scale, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
      }

      const vLength = Math.hypot(obj.vx, obj.vy) * scale * 0.8;
      if (vLength > 2) {
        ctx.strokeStyle = '#FFC857';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(osx, osy);
        ctx.lineTo(osx + obj.vx * scale * 0.8, osy + obj.vy * scale * 0.8);
        ctx.stroke();
      }

      const widthPx = obj.width * scale;
      const lengthPx = obj.length * scale;

      ctx.save();
      ctx.translate(osx, osy);
      ctx.rotate(obj.heading);

      let boxColor = '#FF9933';
      if (obj.object_class === 'Animal') boxColor = '#FFC857';
      else if (obj.object_class === 'Pedestrian') boxColor = '#27E38A';
      else if (obj.object_class === 'Motorcycle') boxColor = '#00D9FF';

      ctx.fillStyle = boxColor;
      ctx.fillRect(-lengthPx / 2, -widthPx / 2, lengthPx, widthPx);

      ctx.strokeStyle = isLight ? '#0F172A' : '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-lengthPx / 2, -widthPx / 2, lengthPx, widthPx);

      ctx.restore();

      ctx.fillStyle = isLight ? '#FFFFFF' : '#07111F';
      ctx.fillRect(osx - 22, osy - widthPx / 2 - 18, 44, 14);
      ctx.strokeStyle = boxColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(osx - 22, osy - widthPx / 2 - 18, 44, 14);

      ctx.fillStyle = isLight ? '#0F172A' : '#F7FAFC';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(obj.id, osx, osy - widthPx / 2 - 8);
    });

    const esx = toScreenX(state.ego.x);
    const esy = toScreenY(state.ego.y);
    const egoLengthPx = 4.8 * scale;
    const egoWidthPx = 2.0 * scale;

    ctx.save();
    ctx.translate(esx, esy);
    ctx.rotate(state.ego.heading);

    const grad = ctx.createRadialGradient(egoLengthPx / 2, 0, 2, egoLengthPx / 2 + 40, 0, 60);
    grad.addColorStop(0, isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(0, 217, 255, 0.4)');
    grad.addColorStop(1, isLight ? 'rgba(2, 132, 199, 0)' : 'rgba(0, 217, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(egoLengthPx / 2, 0);
    ctx.arc(egoLengthPx / 2, 0, 70, -0.4, 0.4);
    ctx.closePath();
    ctx.fill();

    const egoColor = isLight ? '#0284C7' : '#00D9FF';
    ctx.fillStyle = egoColor;
    ctx.shadowColor = egoColor;
    ctx.shadowBlur = isLight ? 6 : 12;
    ctx.fillRect(-egoLengthPx / 2, -egoWidthPx / 2, egoLengthPx, egoWidthPx);
    ctx.shadowBlur = 0;

    ctx.fillStyle = isLight ? '#FFFFFF' : '#07111F';
    ctx.fillRect(-egoLengthPx / 6, -egoWidthPx / 2 + 2, egoLengthPx / 3, egoWidthPx - 4);

    ctx.restore();

    ctx.fillStyle = egoColor;
    ctx.font = 'extrabold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BHARATNAV AV-01', esx, esy - egoWidthPx / 2 - 10);
  }, [state, showRiskGridOverlay, showBaselinePath, showTrajectories, resolvedTheme]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
      <canvas ref={canvasRef} className="w-full h-full block" />

      <div className="absolute top-4 left-4 bg-navy-950/85 backdrop-blur-md p-3 rounded-lg border border-slate-800/80 text-[10px] font-mono space-y-1.5 z-10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-cyan-electric rounded-full shadow-sm shadow-cyan-electric/50"></span>
          <span className="text-slate-200 font-bold">BharatNav Risk-Aware Path</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-slate-400 border-b border-dashed border-slate-400"></span>
          <span className="text-slate-400">Baseline Static Path</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-saffron rounded-full"></span>
          <span className="text-slate-300">Tracked Agents & Trajectories</span>
        </div>
      </div>
    </div>
  );
};


