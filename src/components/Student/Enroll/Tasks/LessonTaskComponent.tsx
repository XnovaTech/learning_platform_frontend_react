
import { getStudentLessonTasks, submitStudentLessonTasks } from "@/services/lessonTaskService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { LessonTaskType, TaskType } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import TaskRendererComponent from "./Render/TaskRendererComponent";
import { Button } from "@/components/ui/button";
import type { StudentLessonSubmitPayload } from "@/types/answer";


interface LessonTaskComponentProps {
    lessonId?: number;
    enrollId?: number;
}

const TASK_TITLE: Record<TaskType, string> = {
    mcq: "Multiple Choice Question",
    short: "Short Answer",
    long: "Long Answer",
    drag_drop: "Drag and Drop",
    matching: "Matching",
    fill_blank: "Fill in the Blanks",
    true_false: "True or False",
}

export default function LessonTaskComponent({ lessonId, enrollId }: LessonTaskComponentProps) {
    const [answers, setAnswers] = useState({});

    const {data: tasks, isLoading} = useQuery<LessonTaskType[]>({
        queryKey: ['student-lesson-tasks', lessonId],
        queryFn: () => getStudentLessonTasks(lessonId!),
        enabled: !!lessonId,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const createMutation = useMutation({
        mutationFn: submitStudentLessonTasks,
        onSuccess: async () => {
            console.log('Submitted successfully');
        },
        onError: (e: any) => {
            console.error(e?.message || 'Failed to submit lesson tasks!');
        }
    })

    const handleAnswer = (taskId: number, value: any) => {
        setAnswers(prev => ({ ...prev, [taskId]: value }));
    };

    console.log('answer is', answers);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createMutation.mutateAsync({
            enroll_id: enrollId,
            lesson_id: Number(lessonId),
            answers: answers
        } as StudentLessonSubmitPayload);

    };

    const groupTasks = tasks?.reduce((acc, task) => {
        if (!acc[task.task_type]) acc[task.task_type] = [];
        acc[task.task_type].push(task);
        return acc;
    }, {} as Record<TaskType, LessonTaskType[]>);

    if (isLoading) {
        return (
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur p-8 flex items-center justify-center h-[60vh]">
                <Spinner className="text-primary size-8" />
            </Card>
        );
    }
    
    return (
        <div className=" drop-shadow-2xl backdrop-blur-lg bg-white/50 dark:bg-slate-900/80 rounded-2xl p-6 md:p-8">
           <h1 className=" text-2xl font-semibold mb-2"> Lesson Tasks</h1>
           {groupTasks && Object.keys(groupTasks).length > 0 ? (
            Object.entries(groupTasks).map(([type, taskList]) => (
                <div key={type} className="mb-8">
                    <h2 className="text-sl font-semibold mb-4 border-b pb-2 text-slate-600">
                        {TASK_TITLE[type as TaskType]}s
                    </h2>

                    {taskList.map((task) => (
                        <Card 
                            key={task.id}
                            className=" border rounded-xl shadow-sm mb-4">
                            <CardContent>
                                <div className="flex justify-between mb-4 font-semibold border-b pb-2">
                                    <h4>{task.question}</h4>
                                    <h4>{task.points} pts</h4>
                                </div>

                                <TaskRendererComponent
                                    task={task}
                                    onAnswer={handleAnswer}
                                />
                            </CardContent>
                        </Card>
                    ))}

                 
                </div>
            )
           )) : (
            <p className="text-gray-600 mt-4 font-semibold">No tasks available for this lesson.</p>
        )}
           <Button onClick={handleSubmit}>
                        Submit
                    </Button>
        </div>
    )
}