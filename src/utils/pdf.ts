import { SELECTION_HANDLE_SIZE, TEXT_PADDING, TEXT_WRAP_WIDTH_OFFSET  } from '@/mocks/toolbar';
import type { Annotation, Bounds, Point, ResizeHandle } from '@/types/pdf';


export function getAnnotationBounds(annotation: Annotation): Bounds {
  if (annotation.type === 'text') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = `${annotation.fontSize}px Arial`;
    const metrics = ctx.measureText(annotation.text);
    return {
      x: annotation.x - TEXT_PADDING,
      y: annotation.y - annotation.fontSize - TEXT_PADDING,
      width: metrics.width + TEXT_PADDING * 2,
      height: annotation.fontSize + TEXT_PADDING * 2,
    };
  }

  if (annotation.type === 'draw') {
    const xs = annotation.points.map((p) => p.x);
    const ys = annotation.points.map((p) => p.y);
    return {
      x: Math.min(...xs) - TEXT_PADDING,
      y: Math.min(...ys) - TEXT_PADDING,
      width: Math.max(...xs) - Math.min(...xs) + TEXT_PADDING * 2,
      height: Math.max(...ys) - Math.min(...ys) + TEXT_PADDING * 2,
    };
  }

  // For shapes, highlights, comments, images (underline has no height)
  if ('x' in annotation && 'width' in annotation) {
    const hasHeight = 'height' in annotation;
    return {
      x: annotation.x - TEXT_PADDING,
      y: annotation.y - TEXT_PADDING,
      width: annotation.width + TEXT_PADDING * 2,
      height: hasHeight ? annotation.height + TEXT_PADDING * 2 : TEXT_PADDING * 2,
    };
  }

  return { x: 0, y: 0, width: 0, height: 0 };
}

export function getResizeHandle(x: number, y: number, bounds: Bounds): ResizeHandle {
  const handles: Record<string, Point> = {
    nw: { x: bounds.x, y: bounds.y },
    ne: { x: bounds.x + bounds.width, y: bounds.y },
    sw: { x: bounds.x, y: bounds.y + bounds.height },
    se: { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
    n: { x: bounds.x + bounds.width / 2, y: bounds.y },
    s: { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height },
    w: { x: bounds.x, y: bounds.y + bounds.height / 2 },
    e: { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 },
  };

  for (const [handle, pos] of Object.entries(handles)) {
    if (
      Math.abs(x - pos.x) <= SELECTION_HANDLE_SIZE &&
      Math.abs(y - pos.y) <= SELECTION_HANDLE_SIZE
    ) {
      return handle as ResizeHandle;
    }
  }
  return null;
}

export function applyResize(
  annotation: Annotation,
  handle: ResizeHandle,
  dx: number,
  dy: number
): Annotation {
  if (annotation.type === 'text') {
    const updated = { ...annotation };
    // Text font-size resize
    switch (handle) {
      case 'n':
        updated.fontSize = Math.max(10, annotation.fontSize - dy);
        break;
      case 's':
        updated.fontSize = Math.max(10, annotation.fontSize + dy);
        break;
      case 'nw':
      case 'ne':
        updated.fontSize = Math.max(10, annotation.fontSize - dy);
        break;
      case 'sw':
      case 'se':
        updated.fontSize = Math.max(10, annotation.fontSize + dy);
        break;
      default:
        break;
    }
    return updated;
  }

  // For resizable annotations
  const updated = { ...annotation };
  if ('x' in updated && 'width' in updated && 'height' in updated) {
    switch (handle) {
      case 'nw':
        updated.x += dx;
        updated.y += dy;
        updated.width -= dx;
        updated.height -= dy;
        break;
      case 'ne':
        updated.y += dy;
        updated.width += dx;
        updated.height -= dy;
        break;
      case 'sw':
        updated.x += dx;
        updated.width -= dx;
        updated.height += dy;
        break;
      case 'se':
        updated.width += dx;
        updated.height += dy;
        break;
      case 'n':
        updated.y += dy;
        updated.height -= dy;
        break;
      case 's':
        updated.height += dy;
        break;
      case 'w':
        updated.x += dx;
        updated.width -= dx;
        break;
      case 'e':
        updated.width += dx;
        break;
    }

    if (updated.width < 0) {
      updated.width = Math.abs(updated.width);
      updated.x -= updated.width;
    }
    if (updated.height < 0) {
      updated.height = Math.abs(updated.height);
      updated.y -= updated.height;
    }
  }

  return updated;
}

export function findAnnotationAt(
  annotations: Annotation[],
  currentPage: number,
  x: number,
  y: number
): Annotation | null {
  return annotations
    .filter((a) => a.page === currentPage)
    .reverse()
    .find((annotation) => {
      if (annotation.type === 'text') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        ctx.font = `${annotation.fontSize}px Arial`;
        const metrics = ctx.measureText(annotation.text);
        const x1 = annotation.x - TEXT_WRAP_WIDTH_OFFSET;
        const y1 = annotation.y - annotation.fontSize - TEXT_WRAP_WIDTH_OFFSET;
        const x2 = annotation.x + metrics.width + TEXT_WRAP_WIDTH_OFFSET;
        const y2 = annotation.y + TEXT_WRAP_WIDTH_OFFSET;
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
      }

      if (annotation.type === 'draw') {
        return annotation.points.some((p) => Math.abs(p.x - x) < 20 && Math.abs(p.y - y) < 20);
      }

      // For shapes, etc.
      if ('x' in annotation && 'width' in annotation && 'height' in annotation) {
        return (
          x >= annotation.x - TEXT_WRAP_WIDTH_OFFSET &&
          x <= annotation.x + annotation.width + TEXT_WRAP_WIDTH_OFFSET &&
          y >= annotation.y - TEXT_WRAP_WIDTH_OFFSET &&
          y <= annotation.y + annotation.height + TEXT_WRAP_WIDTH_OFFSET
        );
      }

      return false;
    }) || null;
}

export function getDrawBounds(points: Point[]): Bounds {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}
