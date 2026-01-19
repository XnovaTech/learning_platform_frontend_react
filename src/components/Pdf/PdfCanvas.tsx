import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import type {  PdfCanvasProps, TextAnnotation } from '@/types/pdf';
import { getAnnotationBounds } from '@/utils/pdf';
import { SELECTION_HANDLE_SIZE } from '@/mocks/toolbar';


const PdfCanvas = forwardRef<any, PdfCanvasProps>(({ pdfDoc, currentPage, scale, annotations, activeTool, onMouseDown, onMouseMove, onMouseUp, onAnnotationUpdate }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [editingAnnotation, setEditingAnnotation] = useState<TextAnnotation | null>(null);
  const [textInputPos, setTextInputPos] = useState<{ x: number; y: number } | null>(null);

  useImperativeHandle(ref, () => ({
    getMousePos: (e: React.MouseEvent) => {
      const canvas = overlayCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    startTextEdit: (annotation: TextAnnotation) => {
      setEditingAnnotation(annotation);
      setEditingText(annotation.text || '');
      const canvas = overlayCanvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        setTextInputPos({
          x: rect.left + annotation.x,
          y: rect.top + annotation.y - annotation.fontSize,
        });
      }
    },
    finishTextEdit: () => {
      if (editingAnnotation && editingText !== editingAnnotation.text) {
        onAnnotationUpdate({ ...editingAnnotation, text: editingText });
      }
      setEditingAnnotation(null);
      setTextInputPos(null);
    },
  }));

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d')!;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const overlayCanvas = overlayCanvasRef.current!;
      overlayCanvas.height = viewport.height;
      overlayCanvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
    };

    renderPage();
  }, [pdfDoc, currentPage, scale]);

  useEffect(() => {
    if (!overlayCanvasRef.current) return;

    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    annotations
      .filter(annotation => annotation.page === currentPage)
      .forEach((annotation) => {
        if (editingAnnotation && editingAnnotation.id === annotation.id) return;

        ctx.strokeStyle = annotation.color;
        ctx.fillStyle = annotation.color;

        switch (annotation.type) {
          case 'draw':
            ctx.lineWidth = annotation.strokeWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            annotation.points.forEach((point, index) => {
              if (index === 0) {
                ctx.moveTo(point.x, point.y);
              } else {
                ctx.lineTo(point.x, point.y);
              }
            });
            ctx.stroke();
            break;

          case 'rectangle':
            ctx.lineWidth = annotation.strokeWidth;
            ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
            break;


      

          case 'text':
            ctx.font = `${annotation.fontSize}px Arial`;
            ctx.fillText(annotation.text, annotation.x, annotation.y);
            break;

          case 'highlight':
            ctx.globalAlpha = 0.3;
            ctx.fillRect(annotation.x, annotation.y, annotation.width, annotation.height);
            ctx.globalAlpha = 1.0;
            break;

          case 'underline':
            ctx.lineWidth = annotation.strokeWidth;
            ctx.beginPath();
            ctx.moveTo(annotation.x, annotation.y);
            ctx.lineTo(annotation.x + annotation.width, annotation.y);
            ctx.stroke();
            break;

          case 'comment':
            ctx.fillStyle = '#FFF3CD';
            ctx.fillRect(annotation.x, annotation.y, annotation.width, annotation.height);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 1;
            ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            const words = annotation.text.split(' ');
            let line = '';
            let yPos = annotation.y + 15;
            words.forEach((word: string) => {
              const testLine = line + word + ' ';
              const metrics = ctx.measureText(testLine);
              if (metrics.width > annotation.width - 10 && line !== '') {
                ctx.fillText(line, annotation.x + 5, yPos);
                line = word + ' ';
                yPos += 15;
              } else {
                line = testLine;
              }
            });
            ctx.fillText(line, annotation.x + 5, yPos);
            break;

          case 'image':
            if (annotation.imageData) {
              const img = new Image();
              img.onload = () => {
                ctx.drawImage(img, annotation.x, annotation.y, annotation.width, annotation.height);
              };
              img.src = annotation.imageData;
            }
            break;
        }

        // Draw selection handles and border
        if (annotation.selected && activeTool === 'select') {
          ctx.strokeStyle = '#0066FF';
          ctx.fillStyle = '#0066FF';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);

          const bounds = getAnnotationBounds(annotation);

          // Draw selection border
          ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
          ctx.setLineDash([]);

          // Draw resize handles (only for resizable types)
          if (annotation.type !== 'draw') {
            const handles = [
              { x: bounds.x, y: bounds.y }, // nw
              { x: bounds.x + bounds.width, y: bounds.y }, // ne
              { x: bounds.x, y: bounds.y + bounds.height }, // sw
              { x: bounds.x + bounds.width, y: bounds.y + bounds.height }, // se
              { x: bounds.x + bounds.width / 2, y: bounds.y }, // n
              { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height }, // s
              { x: bounds.x, y: bounds.y + bounds.height / 2 }, // w
              { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 }, // e
            ];

            handles.forEach((handle) => {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(handle.x - SELECTION_HANDLE_SIZE / 2, handle.y - SELECTION_HANDLE_SIZE / 2, SELECTION_HANDLE_SIZE, SELECTION_HANDLE_SIZE);
              ctx.strokeStyle = '#0066FF';
              ctx.strokeRect(handle.x - SELECTION_HANDLE_SIZE / 2, handle.y - SELECTION_HANDLE_SIZE / 2, SELECTION_HANDLE_SIZE, SELECTION_HANDLE_SIZE);
            });
          }
        }
      });
  }, [annotations, currentPage, activeTool, editingAnnotation]);

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (editingAnnotation) {
        onAnnotationUpdate({ ...editingAnnotation, text: editingText });
      }
      setEditingAnnotation(null);
      setTextInputPos(null);
    }
  };

  return (
    <>
      <div className="relative bg-white shadow-lg">
        <canvas ref={canvasRef} className="block" />
        <canvas ref={overlayCanvasRef} className="absolute top-0 left-0 cursor-crosshair" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} />
      </div>

      {textInputPos && editingAnnotation && (
        <input
          type="text"
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onKeyDown={handleTextKeyDown}
          onBlur={() => {
            if (editingAnnotation) {
              onAnnotationUpdate({ ...editingAnnotation, text: editingText });
            }
            setEditingAnnotation(null);
            setTextInputPos(null);
          }}
          autoFocus
          style={{
            position: 'fixed',
            left: textInputPos.x,
            top: textInputPos.y,
            fontSize: `${editingAnnotation.fontSize}px`,
            color: editingAnnotation.color,
            background: 'transparent',
            border: '1px solid black',
            borderRadius:'5px',
            outline: 'none',
            padding: '2px 4px',
            minWidth: '100px',
            fontFamily: 'Arial',
            zIndex: 1000,
          }}
        />
      )}
    </>
  );
});

PdfCanvas.displayName = 'PdfCanvas';

export default PdfCanvas;
