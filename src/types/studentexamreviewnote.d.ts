export interface StudentExamReviewNote {
  id: number;
  title: string;
  note: string;
}

export interface StudentExamReviewNotePayload {
  title?: string;
  note?: string;
}
