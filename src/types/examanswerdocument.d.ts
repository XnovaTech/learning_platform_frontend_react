export interface ExamAnswerDocumentType {
  id: string | number; 
  exam_answer_id: number | null;
  link: string;
  filename: string;
  pdf_path?: string;
}
