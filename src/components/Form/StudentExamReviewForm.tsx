import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { updateExamAnswer } from '@/services/studentExamAnswerService';
import { listStudentExamReviewNotes } from '@/services/studentExamReviewNoteService';
import type { StudentExamAnswersType } from '@/types/studentexamanswer';


interface StudentExamReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentExamAnswer: StudentExamAnswersType | undefined;
  refetch: () => void;
}

export function StudentExamReviewForm({ open, onOpenChange, studentExamAnswer, refetch }: StudentExamReviewFormProps) {
  const [review, setReview] = useState('');
  const [reviewId, setReviewId] = useState<string>('');

  useEffect(() => {
    if (studentExamAnswer) {
      setReview(studentExamAnswer.review || '');
      setReviewId(studentExamAnswer.note_id ? studentExamAnswer.note_id.toString() : '');
    } else {
      setReview('');
      setReviewId('');
    }
  }, [studentExamAnswer]);

  const { data: reviewNotes = [], isLoading: isLoadingReviewNotes } = useQuery({
    queryKey: ['review-notes'],
    queryFn: listStudentExamReviewNotes,
    enabled: open,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { review: string; status: string; note_id?: number } }) => updateExamAnswer(id, payload),
    onSuccess: async () => {
      toast.success('Review submitted successfully');
      onOpenChange(false);
      setReview('');
      setReviewId('');
      refetch();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to submit review!'),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentExamAnswer) return;

    const payload = { 
      review, 
      status: 'Approved',
      note_id: reviewId ? parseInt(reviewId) : undefined
    };
    await updateMutation.mutateAsync({ id: studentExamAnswer.id, payload });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-xl max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
          <DialogTitle className="text-lg font-semibold mb-4">{studentExamAnswer?.review ? 'Update Review' : 'Give Review'}</DialogTitle>

          <div className="space-y-2">
            <label htmlFor="review" className="text-sm font-medium text-gray-700">Review Comment</label>
            <Textarea 
              id="review" 
              placeholder="Enter your review comment..." 
              value={review} 
              onChange={(e) => setReview(e.target.value)} 
              rows={5} 
              required 
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="note_id" className="text-sm font-medium text-gray-700">Select Review Note (Optional)</label>
            <Select value={reviewId} onValueChange={setReviewId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a review note..." />
              </SelectTrigger>
              <SelectContent>
                {isLoadingReviewNotes ? (
                  <div className="p-2 text-sm text-gray-500">Loading review notes...</div>
                ) : reviewNotes.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No review notes available</div>
                ) : (
                  reviewNotes.map((note) => (
                    <SelectItem key={note.id} value={note.id.toString()}>
                      <div>
                        <div className="font-medium">{note.title}</div>
                        {/* <div className="text-sm text-gray-500">{note.note}</div> */}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button className="rounded-md" type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Spinner className="mr-2" /> : 'Submit Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
