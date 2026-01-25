import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type {  LessonTaskType, LongAnswerExtraData } from '@/types/task';
import { useEffect, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import type { LongAnswer, LongAnswerDocument } from '@/types/answer';
import { useMutation } from '@tanstack/react-query';
import LQDocModalBox from '@/components/LQDocModalBox';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';
import { uploadDocument } from '@/services/studentExamAnswerListService';

interface LongTaskComponentProps {
  task: LessonTaskType | ClassExamQuestionType;
  onAnswer: (taskId: number, value: any) => void;
  value?: LongAnswer;
  readonly?: boolean;
  score?: number;
  onScoreChange?: (taskId: number, score: number) => void;
  isTeacher?: boolean;
  enrollId?: number;
}

export default function LongTaskComponent({ task, onAnswer, value = '', readonly = false, score, onScoreChange, isTeacher = false, enrollId }: LongTaskComponentProps) {
  const minWords = (task?.extra_data as LongAnswerExtraData)?.min_word_count || 50;
  const [text, setText] = useState('');
  const [document, setDocument] = useState<LongAnswerDocument | null>(null);
  const [localScore, setLocalScore] = useState<number>(score ?? 0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<LongAnswerDocument | null>(null);

  useEffect(() => {
    setLocalScore(score ?? 0);
  }, [score]);

  useEffect(() => {
    if (value && typeof value === 'object') {
      // text with document
      setText(String(value.text) || '');
      setDocument(value.document || null);
    } else {
      // text
      setText(String(value || ''));
      setDocument(null);
    }
  }, [value]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const isValid = wordCount >= minWords || document !== null;

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (newDoc) => {
      setDocument(newDoc);
      updateAnswer(text, newDoc);

      toast.success('Document uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload document');
    },
  });

  const handleRemoveDocument = () => {
    setDocument(null);
    updateAnswer(text, null);
    toast.success('Document removed successfully');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    updateAnswer(newText, document);
  };

  const updateAnswer = (textValue: string, doc: LongAnswerDocument | null) => {
    const answerValue = {
      text: textValue,
      document: doc,
    };
    !readonly && onAnswer(task.id, answerValue);
  };

  return (
    <div className="space-y-4">
      {/* Text Input Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Type your answer</Label>
        <Textarea
          disabled={readonly}
          className={`min-h-32 resize-y ${readonly ? 'bg-slate-100 text-slate-600' : ''}`}
          placeholder={`Write at least ${minWords} words...`}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
        />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Minimum words required: {minWords}</span>
          <span className={`font-semibold ${isValid ? 'text-emerald-600' : 'text-red-500'}`}>
            {wordCount} / {minWords} words
          </span>
        </div>
      </div>

      {/* File Upload Section */}
      {!readonly && document == null && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Or upload a Word document</Label>
          <div className="flex items-center gap-2">
            <Input disabled={uploadMutation.isPending || document !== null} type="file" accept=".docx" onChange={handleFileUpload} className="hidden" id={`file-upload-${task.id}`} />
            <Label
              htmlFor={`file-upload-${task.id}`}
              className={`flex items-center gap-2 px-4 py-2 border border-dashed border-primary/30 bg-primary/5 rounded-lg cursor-pointer hover:border-primary transition-colors ${uploadMutation.isPending || document !== null ? 'opacity-50 cursor-not-allowed' : ''}
`}
            >
              <Upload className="h-4 w-4" />
              {uploadMutation.isPending ? 'Uploading...' : 'Choose Word Document'}
            </Label>

            <p className="text-xs text-red-600 ">* Only .docx files up to 2MB are allowed. *</p>
          </div>
        </div>
      )}

      {/* Uploaded Document */}
      {document && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Uploaded Document</Label>
          <div className="space-y-2">
            <div key={'doc' + document.filename} className="flex items-center  justify-between p-2 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-4 w-full flex-wrap justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{document.filename}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDoc(document);
                      setModalOpen(true);
                    }}
                    className="text-xs text-blue-500  underline hover:text-blue-600 duration-300 hover:bg-blue-50 transition-all"
                  >
                    {isTeacher ? 'Review' : 'View'}
                  </Button>

                  {!readonly && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveDocument()} className="h-6 w-6  p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {readonly && onScoreChange && (
        <div className="space-y-2 flex items-center gap-3">
          <Label className="text-base font-medium text-slate-700 mt-2">Score:</Label>
          <div className="flex items-center gap-2">
            <Input type="number" max={task.points || 100} value={localScore} onChange={(e) => setLocalScore(Number(e.target.value))} className="w-30" />
            <Button className="rounded-lg" onClick={() => onScoreChange(task.id, localScore)}>
              Update Score
            </Button>
          </div>
        </div>
      )}

      {modalOpen && (
        <LQDocModalBox
          open={modalOpen}
          onOpenChange={setModalOpen}
          document={selectedDoc}
          isTeacher={isTeacher}
          enrollId={enrollId}
          taskId={task.id}
          onDocumentUpdate={(updatedDoc) => setDocument(updatedDoc)}
        />
      )}
    </div>
  );
}
