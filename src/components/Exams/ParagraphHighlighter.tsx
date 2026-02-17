import React, { useRef, useEffect, useState, useCallback } from 'react';
import Mark from 'mark.js';
import { Highlighter, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParagraphHighlighterProps {
  content: string;
}

const MARK_CLASS = 'selection-mark';

const MARK_STYLE = `
.${MARK_CLASS} {
  background: #fef08a !important;
  color: #000 !important;
  border-radius: 3px;
  padding: 2px 0;
  cursor: pointer;
  border-bottom: 2px solid #facc15;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
`;

export const ParagraphHighlighter: React.FC<ParagraphHighlighterProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<Mark | null>(null);

  const [htmlContent, setHtmlContent] = useState(content);
  const [selectedText, setSelectedText] = useState('');
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
  const [hasHighlights, setHasHighlights] = useState(false);

  const syncHtmlFromDom = useCallback(() => {
    if (!containerRef.current) return;
    setHtmlContent(containerRef.current.innerHTML);
    setHasHighlights(containerRef.current.querySelector(`.${MARK_CLASS}`) !== null);
  }, []);

  const getSelectionInfo = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;

    const text = sel.toString().trim();
    if (!text) return null;

    const range = sel.getRangeAt(0);
    if (!containerRef.current?.contains(sel.anchorNode)) return null;

    const rect = range.getBoundingClientRect();

    return {
      text,
      top: rect.top,
      left: rect.left + rect.width / 2,
    };
  }, []);

  useEffect(() => {
    setHtmlContent(content);
  }, [content]);

  useEffect(() => {
    if (containerRef.current) {
      markRef.current = new Mark(containerRef.current);
    }
  }, []);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.highlighter-toolbar')) return;

      setTimeout(() => {
        const info = getSelectionInfo();

        if (!info) {
          setShowToolbar(false);
          setSelectedText('');
          return;
        }

        setSelectedText(info.text);
        setToolbarPos({ top: info.top, left: info.left });
        setShowToolbar(true);
      }, 10);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [getSelectionInfo]);


  const applyHighlight = useCallback(() => {
    if (!selectedText || !markRef.current) return;

    markRef.current.mark(selectedText, {
      className: MARK_CLASS,
      separateWordSearch: false,
      acrossElements: true,
      done: syncHtmlFromDom,
    });

    window.getSelection()?.removeAllRanges();
    setShowToolbar(false);
    setSelectedText('');
  }, [selectedText, syncHtmlFromDom]);

  const clearAllHighlights = useCallback(() => {
    if (!markRef.current) return;
    markRef.current.unmark({ done: syncHtmlFromDom });
  }, [syncHtmlFromDom]);

  const handleHighlightClick = useCallback(
    (e: React.MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.classList.contains(MARK_CLASS)) return;

      const parent = el.parentNode;
      if (!parent) return;

      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);

      syncHtmlFromDom();
    },
    [syncHtmlFromDom],
  );

  return (
    <div className="relative highlighter-container">
      <style dangerouslySetInnerHTML={{ __html: MARK_STYLE }} />

      <div className="flex justify-between mb-1 items-center">
        <div className="text-xs text-slate-400 flex gap-1 items-center">
          <Highlighter className="h-3 w-3" />
          Select text to highlight. Click highlight to remove.
        </div>

        {hasHighlights && (
          <Button size="sm" variant="ghost" onClick={clearAllHighlights} className="text-xs text-red-500 hover:bg-transparent">
            <Trash2 className="h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>

      <div ref={containerRef} onClick={handleHighlightClick} className="prose max-w-none text-sm p-4 border rounded-xl bg-white select-text" dangerouslySetInnerHTML={{ __html: htmlContent }} />

      {showToolbar && (
        <div
          style={{
            position: 'fixed',
            top: toolbarPos.top - 42,
            left: toolbarPos.left,
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
          className="highlighter-toolbar"
        >
          <div className="flex bg-slate-800 text-white rounded-full shadow px-2 py-1 gap-1">
            <Button
              size="sm"
              variant="ghost"
              onMouseDown={(e) => {
                e.preventDefault();
                applyHighlight();
              }}
              className="text-xs"
            >
              <Highlighter className="h-3 w-3 text-yellow-400" />
              Highlight
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowToolbar(false);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
