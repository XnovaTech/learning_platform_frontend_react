import React from 'react';
import { BookOpen } from 'lucide-react';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';
import { ParagraphHighlighter } from './ParagraphHighlighter';
import { cn } from '@/lib/utils';

interface ParagraphQuestionGroupProps {
  paragraph: any;
  questions: any[];
  title?: string;
  useHighlighter?: boolean;
  highlighterKey?: string;
  children: React.ReactNode;
  heightClassName?: string;
}

export const ParagraphQuestionGroup: React.FC<ParagraphQuestionGroupProps> = ({ paragraph, questions, useHighlighter = false, highlighterKey, children, heightClassName = 'h-[700px] md:h-[500px]' }) => {
  const ParagraphContent = (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <div className="sticky top-0 z-10 border-b bg-white px-4 py-3">
        <h4 className="text-sm font-semibold text-slate-700">Paragraph Content</h4>
      </div>
      <div className={cn('flex-1 overflow-y-auto p-4', !useHighlighter && 'bg-yellow-50/50')}>
        {useHighlighter ? (
          <ParagraphHighlighter key={highlighterKey} content={paragraph?.content || ''} />
        ) : (
          <div
            className="prose prose-slate max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: paragraph?.content || '',
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-800">Paragraph-based Questions</h3>
        </div>

        <div className="flex items-center gap-4">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{questions.length} Questions</span>
        </div>
      </header>

      {/* Main Container */}
      <div className={cn(heightClassName, 'w-full overflow-hidden rounded-xl border bg-slate-50')}>
        {/* mobile*/}
        <div className="flex h-full flex-col md:hidden overflow-y-auto">
          <div className="h-1/2 border-b overflow-hidden">{ParagraphContent}</div>
          <div className="h-1/2 overflow-y-auto bg-slate-50/30">{children}</div>
        </div>

        {/* desktpop  */}
        <div className="hidden md:flex h-full">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={60}>{ParagraphContent}</ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={40}>
              <div className="h-full flex flex-col overflow-hidden bg-slate-50/30">{children}</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </section>
  );
};
