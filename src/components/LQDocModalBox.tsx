import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { LongAnswerDocument } from '@/types/answer';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateDocumentHtml } from '@/services/studentExamAnswerListService';

interface LQDocModalBoxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: LongAnswerDocument | null;
  isTeacher?: boolean;
  enrollId?: number;
  taskId: number;
  onDocumentUpdate?: (updatedDoc: LongAnswerDocument) => void;
}

export default function LQDocModalBox({ open, onOpenChange, document, isTeacher = false, enrollId, taskId, onDocumentUpdate }: LQDocModalBoxProps) {
  const [editedHtml, setEditedHtml] = useState('');

  useEffect(() => {
    if (open && document) {
      setEditedHtml(document.html_content || '');
    }
  }, [open, document]);

  const updateHtmlMutation = useMutation({
    mutationFn: updateDocumentHtml,
    onSuccess: () => {
      if (onDocumentUpdate && document) {
        onDocumentUpdate({ ...document, html_content: editedHtml });
      }
      onOpenChange(false);
      toast.success('Document updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update document');
    },
  });

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

  const handleSave = () => {
    if (document && enrollId) {
      updateHtmlMutation.mutate({
        enroll_id: Number(enrollId),
        exam_id: taskId,
        html_content: editedHtml,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{isTeacher ? 'Review Document' : 'View Document'}</DialogTitle>
      </DialogHeader>

      <DialogContent className="min-w-xs md:min-w-xl lg:min-w-3xl max-w-3xl max-h-[80vh] overflow-y-auto">
        {isTeacher ? (
          <div>
            <ReactQuill value={editedHtml} onChange={setEditedHtml} modules={quillModules} theme="snow" className="min-h-64" />
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateHtmlMutation.isPending}>
                {updateHtmlMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        ) : (
          <div className='leading-relaxed ' dangerouslySetInnerHTML={{ __html: document?.html_content || '' }} />
        )}
      </DialogContent>
    </Dialog>
  );
}
