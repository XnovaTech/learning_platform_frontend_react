import {  useEffect, useRef, useState } from 'react';
import PdfCanvas from '@/components/Pdf/PdfCanvas';
import PdfNavigation from '@/components/Pdf/PdfNavigation';
import { usePdfEditor } from '@/hooks/usePdfEditor';
import PdfToolbar from './PdfToolbar';
import type { Annotation, ResizeHandle, TextAnnotation } from '@/types/pdf';
import { applyResize, findAnnotationAt, getAnnotationBounds, getResizeHandle } from '@/utils/pdf';

export default function PdfEditorPage({ pdfUrl }: { pdfUrl: string }) {
  const canvasRef = useRef<{ getMousePos: (e: React.MouseEvent) => { x: number; y: number }; startTextEdit: (annotation: TextAnnotation) => void } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);

  const {
    pdfDoc,
    currentPage,
    totalPages,
    scale,
    activeTool,
    annotations,
    color,
    strokeWidth,
    fontSize,
    historyIndex,
    history,
    loadPdf,
    setActiveTool,
    setColor,
    setStrokeWidth,
    setFontSize,
    addAnnotation,
    updateAnnotations,
    handleUndo,
    handleRedo,
    handleClearAll,
    handleZoomIn,
    handleZoomOut,
    handlePrevPage,
    handleNextPage,
  } = usePdfEditor();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z for Undo
      if (e.ctrlKey && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Y for Redo
      else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
      // Ctrl+Shift+Z for Redo
      else if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        handleRedo();
      }
      // Delete key to remove selected object
      else if (e.key === 'Delete' && selectedAnnotation) {
        e.preventDefault();
        updateAnnotations(annotations.filter(a => a.id !== selectedAnnotation.id));
        setSelectedAnnotation(null);
      }
      // tools shortcuts
      else if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'v':
            setActiveTool('select');
            break;
          case 't':
            setActiveTool('text');
            break;
          case 'p':
            setActiveTool('draw');
            break;
          case 'h':
            setActiveTool('highlight');
            break;
          case 'u':
            setActiveTool('underline');
            break;
          case 'r':
            setActiveTool('rectangle');
            break;

          case 'm':
            setActiveTool('comment');
            break;
          case 'e':
            setActiveTool('eraser');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnnotation, annotations, handleUndo, handleRedo]);

  useEffect(() => {
    loadPdf(pdfUrl);
  }, [loadPdf, pdfUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const pos = canvasRef.current.getMousePos(e);

    if (activeTool === 'eraser') {
      const toErase = findAnnotationAt(annotations, currentPage, pos.x, pos.y);
      if (toErase) {
        updateAnnotations(annotations.filter(a => a.id !== toErase.id));
      }
      return;
    }

    // Select tool
    if (activeTool === 'select') {
      if (selectedAnnotation && selectedAnnotation.type !== 'draw') {
        const bounds = getAnnotationBounds(selectedAnnotation);
        const handle = getResizeHandle(pos.x, pos.y, bounds);
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
          setDragStart(pos);
          return;
        }
      }

      const clicked = findAnnotationAt(annotations, currentPage, pos.x, pos.y);
      if (clicked) {
        if (selectedAnnotation?.id === clicked.id && clicked.type === 'text') {
          canvasRef.current.startTextEdit(clicked);
          return;
        }

        setSelectedAnnotation(clicked);
        updateAnnotations(
          annotations.map(a => ({
            ...a,
            selected: a.id === clicked.id,
          }))
        );
        setDragStart(pos);
        setIsDragging(true);
      } else {
        setSelectedAnnotation(null);
        updateAnnotations(annotations.map(a => ({ ...a, selected: false })));
      }
      return;
    }

    setIsDrawing(true);

    // Text tool
    if (activeTool === 'text') {
      const id = `${Date.now()}-${Math.random()}`;
      const newAnnotation: TextAnnotation = {
        id,
        type: 'text',
        text: '',
        x: pos.x,
        y: pos.y,
        color,
        fontSize,
        page: currentPage,
      };
      addAnnotation(newAnnotation);
      setTimeout(() => {
        canvasRef.current?.startTextEdit(newAnnotation);
      }, 100);
      return;
    }

    // Comment tool
    if (activeTool === 'comment') {
      const text = prompt('Enter comment:');
      if (text) {
        addAnnotation({
          id: `${Date.now()}-${Math.random()}`,
          type: 'comment',
          text,
          x: pos.x,
          y: pos.y,
          width: 200,
          height: 100,
          color,
          page: currentPage,
        });
      }
      return;
    }

    // Drawing tools
    if (activeTool === 'draw') {
      setCurrentAnnotation({
        id: `${Date.now()}-${Math.random()}`,
        type: 'draw',
        points: [pos],
        color,
        strokeWidth,
        page: currentPage,
      } as Annotation);
    } else if (['rectangle', 'highlight', 'underline'].includes(activeTool || '')) {
      setCurrentAnnotation({
        id: `${Date.now()}-${Math.random()}`,
        type: activeTool,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color,
        strokeWidth,
        page: currentPage,
      } as Annotation);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const pos = canvasRef.current.getMousePos(e);

    if (isResizing && selectedAnnotation && dragStart) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      const updated = applyResize(selectedAnnotation, resizeHandle, dx, dy);
      updateAnnotations(annotations.map(a => (a.id === selectedAnnotation.id ? updated : a)));
      setSelectedAnnotation(updated);
      setDragStart(pos);
      return;
    }

    if (isDragging && selectedAnnotation && dragStart) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;

      let updated: Annotation = { ...selectedAnnotation };
      if (updated.type === 'text') {
        (updated as any).x += dx;
        (updated as any).y += dy;
      } else if (updated.type === 'draw') {
        updated.points = updated.points.map(p => ({
          x: p.x + dx,
          y: p.y + dy,
        }));
      } else if ('x' in updated && 'y' in updated) {
        updated.x += dx;
        updated.y += dy;
      }

      updateAnnotations(annotations.map(a => (a.id === selectedAnnotation.id ? updated : a)));
      setSelectedAnnotation(updated);
      setDragStart(pos);
      return;
    }

    if (!isDrawing || !currentAnnotation) return;

    if (activeTool === 'draw' && currentAnnotation.type === 'draw') {
      const updated = {
        ...currentAnnotation,
        points: [...currentAnnotation.points, pos],
      };
      setCurrentAnnotation(updated);
      updateAnnotations([...annotations.filter(a => a.id !== currentAnnotation.id), updated]);
    } else if ('x' in currentAnnotation && 'width' in currentAnnotation) {
      const updated = {
        ...currentAnnotation,
        width: pos.x - currentAnnotation.x,
        height: pos.y - currentAnnotation.y,
      };
      setCurrentAnnotation(updated);
      updateAnnotations([...annotations.filter(a => a.id !== currentAnnotation.id), updated]);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentAnnotation) {
      addAnnotation(currentAnnotation);
      setCurrentAnnotation(null);
    }
    setIsDrawing(false);
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          addAnnotation({
            id: `${Date.now()}-${Math.random()}`,
            type: 'image',
            imageData: ev.target?.result as string,
            x: 100,
            y: 100,
            width: 200,
            height: 200,
            color: '#000',
            page: currentPage,
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <PdfToolbar
        activeTool={activeTool || 'select'}
        onToolChange={setActiveTool}
        color={color}
        onColorChange={setColor}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        scale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearAll={handleClearAll}
        onImageUpload={handleImageUpload}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      <div className="flex-1 overflow-auto bg-gray-200 p-8">
        <div className="flex justify-center">
          {pdfDoc && (
            <PdfCanvas
              ref={canvasRef}
              pdfDoc={pdfDoc}
              currentPage={currentPage}
              scale={scale}
              annotations={annotations}
              activeTool={activeTool}
              selectedAnnotation={selectedAnnotation}
              color={color}
              fontSize={fontSize}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onAnnotationSelect={setSelectedAnnotation}
              onAnnotationUpdate={(updated: Annotation) => {
                updateAnnotations(annotations.map(a => (a.id === updated.id ? updated : a)));
              }}
            />
          )}
        </div>
      </div>

      <PdfNavigation currentPage={currentPage} totalPages={totalPages} onPrevPage={handlePrevPage} onNextPage={handleNextPage} />
    </div>
  );
}
