import { useEffect, useRef } from "react";

const TILE_SIZE = 220;
const ALPHA = 22;
const FRAME_MS = 50;

function paintFrame(ctx: CanvasRenderingContext2D, size: number) {
  const img = ctx.createImageData(size, size);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = ALPHA;
  }
  ctx.putImageData(img, 0, 0);
}

export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;

    paintFrame(ctx, TILE_SIZE);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => paintFrame(ctx, TILE_SIZE), FRAME_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="grain-overlay pointer-events-none fixed inset-0 z-[60]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
