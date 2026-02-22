import type { ClassExamQuestionType, CourseExamQuestionType } from "@/types/courseexamquestion";

export interface ParagraphGroup {
  paragraphId: number;
  paragraph: any;
  questions: ClassExamQuestionType[] | CourseExamQuestionType[];
}

export const groupQuestionsByParagraph = (questions: ClassExamQuestionType[] | CourseExamQuestionType[]) => {
  const questionsWithoutParagraph = questions.filter((q) => !q.paragraph_id);
  const questionsWithParagraph = questions.filter((q) => q.paragraph_id);

  const groupsRecord = questionsWithParagraph.reduce(
    (acc, question) => {
      const paragraphId = question.paragraph_id!;
      if (!acc[paragraphId]) {
        acc[paragraphId] = {
          paragraphId,
          paragraph: question.paragraph,
          questions: [],
        };
      }
      acc[paragraphId].questions.push(question);
      return acc;
    },
    {} as Record<number, ParagraphGroup>
  );

  return {
    paragraphGroups: Object.values(groupsRecord),
    questionsWithoutParagraph,
  };
};
