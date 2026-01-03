import { useState, useCallback } from 'react';
import pdfjsLib from '@/utils/pdfjs';
import type { Annotation, ToolType } from '@/types/pdf';
import { TOOLS } from '@/mocks/toolbar';
import {
  DEFAULT_SCALE,
  MIN_SCALE,
  MAX_SCALE,
  SCALE_STEP,
  DEFAULT_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_FONT_SIZE,
} from '@/mocks/toolbar';

export function usePdfEditor() {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [activeTool, setActiveTool] = useState<ToolType>(TOOLS.SELECT);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_STROKE_WIDTH);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [history, setHistory] = useState<Annotation[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const loadPdf = useCallback(async (url: string) => {
    try {
      const pdf = await pdfjsLib.getDocument(url).promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }, []);

  const addAnnotation = useCallback(
    (annotation: Annotation) => {
      const newAnnotations = [...annotations, annotation];
      setAnnotations(newAnnotations);

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newAnnotations);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [annotations, history, historyIndex]
  );

  const updateAnnotations = useCallback((newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAnnotations(history[historyIndex - 1] || []);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAnnotations(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const handleClearAll = useCallback(() => {
    if (confirm('Clear all annotations?')) {
      setAnnotations([]);
      setHistory([[]]);
      setHistoryIndex(0);
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - SCALE_STEP, MIN_SCALE));
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handleAnnotationRemove = useCallback((annotationId: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== annotationId));
  }, []);

  return {
    pdfDoc,
    currentPage,
    totalPages,
    scale,
    activeTool,
    annotations,
    color,
    strokeWidth,
    fontSize,
    history,
    historyIndex,
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
    handleAnnotationRemove,
    handleZoomIn,
    handleZoomOut,
    handlePrevPage,
    handleNextPage,
  };
}
