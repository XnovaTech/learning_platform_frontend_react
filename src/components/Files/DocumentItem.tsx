import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FileIcon } from 'lucide-react';
import type { LessonDocumentType } from '@/types/lessondocument';
import { FileViewer } from './FileViewer';

export default function DocumentItem({ doc }: { doc: LessonDocumentType }) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-2 border rounded-lg">
        <div className="flex items-center gap-2">
          <FileIcon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm">{doc.filename}</span>
        </div>

        <Button type="button" variant={'red'} size="sm" onClick={() => setIsViewerOpen(true)}>
          View
        </Button>
      </div>

      {isViewerOpen && <FileViewer isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} fileUrl={doc.link} filename={doc.filename} />}
    </>
  );
}
