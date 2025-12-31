import TaskRendererComponent from "@/components/Student/Enroll/Tasks/Render/TaskRendererComponent";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getStudentLessonTasks } from "@/services/lessonTaskService";
import {
  getStudentLessonRecordDetail,
  updateStudentMark,
} from "@/services/studentLessonTaskService";
import type { StudentMarkUpdatePayload } from "@/types/answer";
import type { LessonTaskType, TaskType } from "@/types/task";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

/* ---------- Task Group Titles ---------- */
const TASK_TITLE: Record<TaskType, string> = {
  mcq: "Multiple Choice Question",
  short: "Short Answer",
  long: "Long Answer",
  drag_drop: "Drag & Drop",
  matching: "Matching",
  fill_blank: "Fill in the Blanks",
  true_false: "True or False",
  paragraph_drag: "Paragraph Reading",
};

export default function StudentTaskDetail() {
  const { lessonId, enrollId } = useParams();
  const lessonID = Number(lessonId);
  const enrollID = Number(enrollId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- Queries ---------- */
  const { data: answers, isLoading: loadingAnswers, refetch } = useQuery({
    queryKey: ["studentRecord", enrollID],
    queryFn: () => getStudentLessonRecordDetail(enrollID, lessonID),
    enabled: !!lessonID && !!enrollID,
  });

  const { data: tasks, isLoading: loadingTasks } = useQuery<LessonTaskType[]>({
    queryKey: ["lesson-task", lessonID],
    queryFn: () => getStudentLessonTasks(lessonID),
    enabled: !!lessonID,
  });

  /* ---------- Mutation ---------- */
  const updateMarkMutation = useMutation({
    mutationFn: updateStudentMark,
    onSuccess: () => {
      toast.success("Point updated");
      setIsSubmitting(false);
      refetch();
    },
    onError: () => {
      toast.error("Failed to update score");
      setIsSubmitting(false);
    },
  });

  const handleScoreChange = async (taskId: number, score: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    await updateMarkMutation.mutateAsync({
      enroll_id: enrollID,
      task_id: taskId,
      score,
    } as StudentMarkUpdatePayload);
  };

  /* ---------- Helpers ---------- */
  const getParsedAnswer = (taskId: number) => {
    const record = answers?.[taskId];
    if (!record) return undefined;

    try {
      return JSON.parse(record.answer);
    } catch {
      return record.answer;
    }
  };

  const groupedTasks = tasks?.reduce((acc, task) => {
    if (!acc[task.task_type]) acc[task.task_type] = [];
    acc[task.task_type].push(task);
    return acc;
  }, {} as Record<TaskType, LessonTaskType[]>);

  const totalPossibleScore = tasks?.reduce((sum, task) => sum + (task.points || 0), 0) || 0;

  const totalStudentScore = tasks?.reduce((sum, task) => {
    const score = answers?.[task.id]?.score;
    return sum + (typeof score === "number" ? score : 0);
  }, 0) || 0;

  /* ---------- Loading ---------- */
  if (loadingAnswers || loadingTasks) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="p-10 flex justify-center">
          <Spinner className="size-8 text-primary" />
        </Card>
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Student Answers & Marks</h1>

        <div className="text-sm font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">
           Total Score:{" "}
          <span className="text-green-600">{totalStudentScore}</span>
          {" / "}
          <span className="text-slate-800">{totalPossibleScore}</span>
        </div>
      </div>

      {groupedTasks &&
        Object.entries(groupedTasks).map(([type, taskList]) => (
          <section key={type} className="space-y-4">
            {/* Group Header */}
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold text-slate-800">
                {TASK_TITLE[type as TaskType]}
              </h2>
              <span className="text-sm text-slate-500">
                {taskList.length} questions
              </span>
            </div>

            {/* Tasks */}
            {taskList.map((task) => {
              const score = answers?.[task.id]?.score;

              return (
                <Card key={task.id} className="p-5 rounded-xl shadow">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    {task.task_type !== "paragraph_drag" ? (
                      <div
                        className="prose prose-slate max-w-none text-sm"
                        dangerouslySetInnerHTML={{
                          __html: task.question || "",
                        }}
                      />
                    ) : (
                      <p className="font-medium">Choose the correct answers</p>
                    )}

                    <span className="text-sm font-medium bg-slate-100 px-2 py-1 rounded">
                      {task.points} pts
                    </span>
                  </div>

                  <TaskRendererComponent
                    task={task}
                    value={getParsedAnswer(task.id)}
                    readonly
                    score={score}
                    onScoreChange={handleScoreChange}
                  />

                  {score !== undefined && (
                    <div className="mt-3 text-right font-semibold text-green-600">
                      Score: {score} / {task.points}
                    </div>
                  )}
                </Card>
              );
            })}
          </section>
        ))}
    </div>
  );
}
