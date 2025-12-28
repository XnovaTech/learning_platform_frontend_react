import TaskRendererComponent from "@/components/Student/Enroll/Tasks/Render/TaskRendererComponent";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getStudentLessonTasks } from "@/services/lessonTaskService";
import { getStudentLessonRecordDetail } from "@/services/studentLessonTaskService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function StudentTaskDetail() {
  const params = useParams();
  const lessonId = Number(params.lessonId);
  const enrollId = Number(params.enrollId);

  const { data: answers, isLoading: isLoadingAnswers } = useQuery({
    queryKey: ['studentRecord', enrollId],
    queryFn: () => getStudentLessonRecordDetail(enrollId, lessonId),
    enabled: !!lessonId && !!enrollId,
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['lesson-task', lessonId],
    queryFn: () => getStudentLessonTasks(lessonId),
    enabled: !!lessonId,
  });

  const isLoading = isLoadingAnswers || isLoadingTasks;

  if (isLoading) {
    return (
      <div className="max-w-8xl p-4 mx-auto space-y-6">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur p-6">
          <div className="flex items-center justify-center py-14">
            <Spinner className="text-primary size-7 md:size-8" />
          </div>
        </Card>
      </div>
    );
  }

  const getParsedAnswer = (taskId: number) => {
    const record = answers?.[taskId];
    if (!record) return undefined;

    const raw = record.answer;

    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Student Answers & Marks</h1>

      {tasks?.map((task) => (
        <Card key={task.id} className="p-4 shadow-lg rounded-xl">
          <div className="flex justify-between items-center mb-4">
             { task.task_type !== 'paragraph_drag' ?  <div
                        className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800"
                        dangerouslySetInnerHTML={{
                          __html: task.question || '',
                        }}
                      /> : <p>Choose the correct answers</p>}
              
            <span className="font-medium text-gray-700">{task.points} pts</span>
          </div>

          <TaskRendererComponent
            task={task}
            value={getParsedAnswer(task.id)}
            readonly={true} // make readonly for teacher view
            score={answers?.[task.id]?.score}
          />

          {/* Optional: display student's score if available */}
          {answers?.[task.id]?.score !== undefined && (
            <div className="mt-2 text-right font-semibold text-green-600">
              Score: {answers[task.id].score} / {task.points}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
