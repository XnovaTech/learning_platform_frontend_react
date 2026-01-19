import type { TOOLS } from "@/mocks/toolbar";
export type ToolType = typeof TOOLS[keyof typeof TOOLS];
export type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;


export interface Point {
  x: number;
  y: number;
}

export interface BaseAnnotation {
  id: string;
  type: ToolType;
  color: string;
  page: number;
  selected?: boolean;
}

export interface DrawAnnotation extends BaseAnnotation {
  type: typeof TOOLS.DRAW;
  points: Point[];
  strokeWidth: number;
}

export interface ShapeAnnotation extends BaseAnnotation {
  type: typeof TOOLS.RECTANGLE
  x: number;
  y: number;
  width: number;
  height: number;
  strokeWidth: number;
}

export interface TextAnnotation extends BaseAnnotation {
  type: typeof TOOLS.TEXT;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  isEditing?: boolean;
}

export interface HighlightAnnotation extends BaseAnnotation {
  type: typeof TOOLS.HIGHLIGHT;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UnderlineAnnotation extends BaseAnnotation {
  type: typeof TOOLS.UNDERLINE;
  x: number;
  y: number;
  width: number;
  strokeWidth: number;
}

export interface CommentAnnotation extends BaseAnnotation {
  type: typeof TOOLS.COMMENT;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageAnnotation extends BaseAnnotation {
  type: typeof TOOLS.IMAGE;
  imageData: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Annotation = 
  | DrawAnnotation 
  | ShapeAnnotation 
  | TextAnnotation 
  | HighlightAnnotation 
  | UnderlineAnnotation 
  | CommentAnnotation
  | ImageAnnotation;

export interface PdfToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  color: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearAll: () => void;
  onExport?: () => void;
  onImageUpload: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface PdfCanvasRef {
  getMousePos: (e: React.MouseEvent) => { x: number; y: number };
}

export interface PdfCanvasProps {
  pdfDoc: any;
  currentPage: number;
  scale: number;
  annotations: Annotation[];
  activeTool?: string;
  selectedAnnotation?: Annotation | null;
  color?: string;
  fontSize?: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onAnnotationSelect?: (annotation: Annotation | null) => void;
  onAnnotationUpdate: (annotation: Annotation) => void;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
