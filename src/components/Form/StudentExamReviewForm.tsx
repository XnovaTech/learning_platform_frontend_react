import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { updateExamAnswer } from '@/services/studentExamAnswerService';
import type { StudentExamAnswersType } from '@/types/studentexamanswer';

interface StudentExamReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentExamAnswer: StudentExamAnswersType | undefined;
  refetch: () => void;
}

export function StudentExamReviewForm({ open, onOpenChange, studentExamAnswer, refetch }: StudentExamReviewFormProps) {
  const [review, setReview] = useState('');

  useEffect(() => {
    if (studentExamAnswer) {
      setReview(studentExamAnswer.review || '');
    }
  }, [studentExamAnswer]);

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { review: string; status: string } }) => updateExamAnswer(id, payload),
    onSuccess: async () => {
      toast.success('Review submitted successfully');
      onOpenChange(false);
      setReview('');
      refetch();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to submit review!'),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentExamAnswer) return;

    const payload = { review, status: 'Approved' };
    await updateMutation.mutateAsync({ id: studentExamAnswer.id, payload });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-xl max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
          <DialogTitle className="text-lg font-semibold mb-4">{studentExamAnswer?.review ? 'Update Review' : 'Give Review'}</DialogTitle>

          <div className="space-y-2">
            <Textarea id="review" placeholder="Enter your review comment..." value={review} onChange={(e) => setReview(e.target.value)} rows={5} required />
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
