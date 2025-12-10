
import { getStudentLessonTasks } from "@/services/lessonTaskService";
import { useQuery } from "@tanstack/react-query";
import type { LessonTaskType } from "@/types/task";
import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import TaskRendererComponent from "./Render/TaskRendererComponent";


interface LessonTaskComponentProps {
    lessonId?: number;
}

export default function LessonTaskComponent({ lessonId }: LessonTaskComponentProps) {
    const [answers, setAnswers] = useState({});

    const {data: tasks, isLoading} = useQuery<LessonTaskType[]>({
        queryKey: ['student-lesson-tasks', lessonId],
        queryFn: () => getStudentLessonTasks(lessonId!),
        enabled: !!lessonId,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const handleAnswer = (taskId: number, value: any) => {
        setAnswers(prev => ({ ...prev, [taskId]: value }));
    };

    const handleSubmit = () => {
        console.log("Final Answers:", answers);
    };

      if (isLoading) {
        return (
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur p-8 flex items-center justify-center h-[60vh]">
                <Spinner className="text-primary size-8" />
            </Card>
        );
    }
    
    return (
        <div className=" drop-shadow-2xl backdrop-blur-lg bg-white/50 dark:bg-slate-900/80 rounded-2xl p-6 md:p-8 text-center">
           <h1 className=" text-3xl font-bold"> Lesson Tasks</h1>
           {
            tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                    <Card key={task.id} className="border rounded-xl shadow-sm">
                        <CardHeader>
                            <CardTitle className=" text-lg font-semibold"> {task.question} </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TaskRendererComponent 
                                task={task} 
                                onAnswer={(value: any) => handleAnswer(task.id, value)} 
                            />
                        </CardContent>
                    </Card>    
                ))            ) : (
                <p className=" text-gray-600 mt-4">No tasks available for this lesson.</p>
            )
           }
        </div>
    )
}