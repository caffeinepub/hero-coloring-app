import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface DrawingSurfaceProps {
  templateImage: string;
  color: string;
  strokeWidth: number;
}

interface DrawingPoint {
  x: number;
  y: number;
  color: string;
  width: number;
}

export interface DrawingSurfaceRef {
  clear: () => void;
  exportImage: () => Promise<Blob>;
}

type TemplateStatus = 'loading' | 'loaded' | 'error';

const DrawingSurface = forwardRef<DrawingSurfaceRef, DrawingSurfaceProps>(
  ({ templateImage, color, strokeWidth }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const templateCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<(DrawingPoint | null)[]>([]);
    const [templateStatus, setTemplateStatus] = useState<TemplateStatus>('loading');
    const [canvasSize, setCanvasSize] = useState({ width: 1024, height: 1024 });

    // Initialize canvases with default size immediately
    useEffect(() => {
      const canvas = canvasRef.current;
      const templateCanvas = templateCanvasRef.current;
      if (!canvas || !templateCanvas) return;

      // Set default size immediately so drawing works before template loads
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      templateCanvas.width = canvasSize.width;
      templateCanvas.height = canvasSize.height;
    }, [canvasSize]);

    // Load template image with error handling
    useEffect(() => {
      const canvas = templateCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setTemplateStatus('loading');

      const img = new Image();
      
      img.onload = () => {
        // Update canvas size based on loaded image
        const newSize = { width: img.width, height: img.height };
        setCanvasSize(newSize);
        
        canvas.width = newSize.width;
        canvas.height = newSize.height;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img, 0, 0);
        ctx.globalAlpha = 1.0;
        
        setTemplateStatus('loaded');
      };

      img.onerror = () => {
        console.error('Failed to load template image:', templateImage);
        setTemplateStatus('error');
        // Keep default canvas size for drawing even if template fails
      };

      img.src = templateImage;

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }, [templateImage]);

    // Redraw all points whenever they change (independent of template status)
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure canvas matches current size
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < points.length - 1; i++) {
        if (points[i] && points[i + 1]) {
          const p1 = points[i]!;
          const p2 = points[i + 1]!;

          ctx.strokeStyle = p1.color;
          ctx.lineWidth = p1.width;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        } else if (points[i] && !points[i + 1]) {
          const p = points[i]!;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.width / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }, [points, canvasSize]);

    const getCanvasPoint = (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const handlePointerDown = (e: React.PointerEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.setPointerCapture(e.pointerId);
      setIsDrawing(true);
      
      const point = getCanvasPoint(e.clientX, e.clientY);
      if (point) {
        setPoints((prev) => [...prev, { ...point, color, width: strokeWidth }]);
      }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      
      const point = getCanvasPoint(e.clientX, e.clientY);
      if (point) {
        setPoints((prev) => [...prev, { ...point, color, width: strokeWidth }]);
      }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (isDrawing) {
        setIsDrawing(false);
        setPoints((prev) => [...prev, null]);
        canvas.releasePointerCapture(e.pointerId);
      }
    };

    useImperativeHandle(ref, () => ({
      clear: () => {
        setPoints([]);
      },
      exportImage: async () => {
        const templateCanvas = templateCanvasRef.current;
        const drawingCanvas = canvasRef.current;
        if (!templateCanvas || !drawingCanvas) {
          throw new Error('Canvas not ready');
        }

        // Create a new canvas to merge both layers
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = canvasSize.width;
        exportCanvas.height = canvasSize.height;
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) throw new Error('Could not get context');

        // Draw white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        // Draw template at full opacity if loaded
        if (templateStatus === 'loaded') {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = templateImage;
          });
          ctx.drawImage(img, 0, 0);
        }

        // Draw user strokes
        ctx.drawImage(drawingCanvas, 0, 0);

        return new Promise<Blob>((resolve, reject) => {
          exportCanvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to export image'));
          }, 'image/png');
        });
      },
    }));

    return (
      <div ref={containerRef} className="relative mx-auto h-full max-h-[70vh] max-w-3xl">
        {/* Template Status Indicator */}
        {templateStatus === 'loading' && (
          <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-hero-blue/90 px-4 py-2 text-sm font-bold text-white shadow-lg">
            Loading template...
          </div>
        )}
        {templateStatus === 'error' && (
          <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-hero-orange/90 px-4 py-2 text-sm font-bold text-white shadow-lg">
            <AlertCircle className="h-4 w-4" />
            Template failed, but you can still draw!
          </div>
        )}

        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Template Layer */}
          <canvas 
            ref={templateCanvasRef} 
            className="absolute inset-0 h-full w-full object-contain pointer-events-none" 
          />

          {/* Drawing Layer */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full touch-none object-contain cursor-crosshair"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </div>
      </div>
    );
  }
);

DrawingSurface.displayName = 'DrawingSurface';

export default DrawingSurface;
