import { Type, Square, Pen, Eraser, MousePointer2, Image as ImageIcon, Highlighter, MessageSquare, Underline as UnderlineIcon } from 'lucide-react';
export const TOOLS = {
  SELECT: 'select',
  TEXT: 'text',
  DRAW: 'draw',
  RECTANGLE: 'rectangle',
  ERASER: 'eraser',
  IMAGE: 'image',
  HIGHLIGHT: 'highlight',
  COMMENT: 'comment',
  UNDERLINE: 'underline',
} as const;

export const SELECTION_HANDLE_SIZE = 8;
export const DEFAULT_SCALE = 1.5;
export const MIN_SCALE = 0.5;
export const MAX_SCALE = 3;
export const SCALE_STEP = 0.25;
export const DEFAULT_COLOR = '#FF0000';
export const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_FONT_SIZE = 16;
export const TEXT_PADDING = 5;
export const COMMENT_PADDING = 10;
export const TEXT_WRAP_WIDTH_OFFSET = 10;


export const toolButtons = [
  { tool: 'select', icon: MousePointer2, label: 'Select & Move' },
  { tool: 'text', icon: Type, label: 'Text' },
  { tool: 'draw', icon: Pen, label: 'Draw' },
  { tool: 'highlight', icon: Highlighter, label: 'Highlight' },
  { tool: 'underline', icon: UnderlineIcon, label: 'Underline' },
  { tool: 'rectangle', icon: Square, label: 'Rectangle' },
  { tool: 'comment', icon: MessageSquare, label: 'Comment' },
  { tool: 'image', icon: ImageIcon, label: 'Image' },
  { tool: 'eraser', icon: Eraser, label: 'Eraser' },
];
