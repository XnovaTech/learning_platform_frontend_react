import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CourseExamType, LessonTaskType, LongAnswerExtraData } from '@/types/task';
import { useEffect, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { uploadExamAnswerDocument, deleteExamAnswerDocument } from '@/services/examAnswerDocumentService';
import { toast } from 'sonner';
import type { ExamAnswerDocumentType } from '@/types/examanswerdocument';
import type { LongAnswer } from '@/types/answer';
import { useMutation } from '@tanstack/react-query';

interface LongTaskComponentProps {
  task: LessonTaskType | CourseExamType;
  onAnswer: (taskId: number, value: any) => void;
  value?: LongAnswer;
  readonly?: boolean;
  score?: number;
  onScoreChange?: (taskId: number, score: number) => void;
  isTeacher?: boolean;
}

export default function LongTaskComponent({ task, onAnswer, value = '', readonly = false, score, onScoreChange }: LongTaskComponentProps) {
  const minWords = (task?.extra_data as LongAnswerExtraData)?.min_word_count || 50;
  const [text, setText] = useState('');
  const [documents, setDocuments] = useState<ExamAnswerDocumentType[]>([]);
  const [localScore, setLocalScore] = useState<number>(score ?? 0);

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadExamAnswerDocument(formData),
    onSuccess: (newDoc) => {
      setDocuments((prev) => [...prev, newDoc]);
      updateAnswer(text, [...documents, newDoc]);
      toast.success('Document uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload document');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (documentId: number) => deleteExamAnswerDocument(documentId),
    onSuccess: (_, documentId) => {
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      const updatedDocs = documents.filter((doc) => doc.id !== documentId);
      updateAnswer(text, updatedDocs);
      toast.success('Document removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove document');
    },
  });

  useEffect(() => {
    setLocalScore(score ?? 0);
  }, [score]);

  useEffect(() => {
    if (value && typeof value === 'object') {
      // text with documents
      setText(String(value.text) || '');
      setDocuments(value.documents || []);
    } else {
      // text
      setText(String(value || ''));
      setDocuments([]);
    }
  }, [value]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const isValid = wordCount >= minWords || documents.length > 0;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_answer_id', 'temp');

    uploadMutation.mutate(formData);
    event.target.value = '';
  };

  const handleRemoveDocument = (documentId: string | number) => {
    // for temp doc,just remove state
    if (typeof documentId === 'string') {
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      const updatedDocs = documents.filter((doc) => doc.id !== documentId);
      updateAnswer(text, updatedDocs);
      toast.success('Document removed successfully');
    } else {
      deleteMutation.mutate(documentId);
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    updateAnswer(newText, documents);
  };

  const updateAnswer = (textValue: string, docs: ExamAnswerDocumentType[]) => {
    const answerValue = {
      text: textValue,
      documents: docs,
    };
    !readonly && onAnswer(task.id, answerValue);
  };

  return (
    <div className="space-y-4">
      {/* Text Input Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Type your answer</Label>
        <Textarea
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
      {!readonly && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Or upload a Word document</Label>
          <div className="flex items-center gap-2">
            <Input type="file" accept=".docx" onChange={handleFileUpload} disabled={uploadMutation.isPending} className="hidden" id={`file-upload-${task.id}`} />
            <Label
              htmlFor={`file-upload-${task.id}`}
              className={`flex items-center gap-2 px-4 py-2 border border-dashed border-primary/30 bg-primary/5 rounded-lg cursor-pointer hover:border-primary transition-colors ${uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className="h-4 w-4" />
              {uploadMutation.isPending ? 'Uploading...' : 'Choose Word Document'}
            </Label>

            <p className="text-xs text-red-600 ">* Only .docx files up to 2MB are allowed. *</p>
          </div>
        </div>
      )}

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Uploaded Documents</Label>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center  justify-between p-2 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-4 w-full flex-wrap justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{doc.filename}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a href={doc.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      View
                    </a>
                    {/* {isTeacher && (
                      <Button
                        type="button"
                        variant="red"
                        className="text-xs"
                        size="sm"
                        onClick={() => {
                          setPdfUrl(doc.link);
                        }}
                      >
                        Review
                      </Button>
                    )} */}

                    {!readonly && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveDocument(doc.id)} className="h-6 w-6  p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}
