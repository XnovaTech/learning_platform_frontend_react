import { ZoomIn, ZoomOut, Download, Undo, Redo, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toolButtons } from '@/mocks/toolbar';
import type { PdfToolbarProps } from '@/types/pdf';

export default function PdfToolbar({
  activeTool,
  onToolChange,
  color,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  fontSize,
  onFontSizeChange,
  scale,
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
  onClearAll,
  onExport,
  onImageUpload,
  canUndo,
  canRedo,
}: PdfToolbarProps) {
  return (
    <div className="bg-white border-b shadow-sm p-3 flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 border-r pr-3">
        <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo}>
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo}>
          <Redo className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-r pr-3">
        {toolButtons.map(({ tool, icon: Icon, label }) => (
          <Button key={tool} variant={activeTool === tool ? 'default' : 'ghost'} size="sm" onClick={() => (tool === 'image' ? onImageUpload() : onToolChange(tool as any))} title={label}>
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2 border-r pr-3">
        <Input type="color" value={color} onChange={(e) => onColorChange(e.target.value)} className="w-12 h-8 p-1 cursor-pointer" />
        <div className="flex flex-col gap-1">
          <Input
            type="number"
            value={activeTool === 'text' ? fontSize : strokeWidth}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (activeTool === 'text') {
                onFontSizeChange(val);
              } else {
                onStrokeWidthChange(val);
              }
            }}
            className="w-16 h-8 text-xs"
            min="1"
            max="50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onZoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
        <Button variant="ghost" size="sm" onClick={onZoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button size="sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
