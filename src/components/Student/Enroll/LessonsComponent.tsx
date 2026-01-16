import { BookOpen, Lock, Unlock, Sparkles, Star, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { updateLockState } from '@/services/lessonService';
import type { LessonLockType, LessonType } from '@/types/lesson';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface LessonComponentProps {
  lessons?: LessonType[];
  enrollId?: number;
  isTeacher?: number;
  classroomId?: number;
  courseId?: number;
}

export function LessonsComponent({ lessons = [], enrollId, isTeacher = 0, classroomId, courseId }: LessonComponentProps) {
  const queryClient = useQueryClient();

  const updateLockMutation = useMutation({
    mutationFn: (payload: LessonLockType) => updateLockState(payload),
    onSuccess: async (_, variables) => {
      toast.success('Lesson lock state updated!');
      await queryClient.invalidateQueries({
        queryKey: ['classes', variables.classroomId],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update lock state');
    },
  });

  const handleLockToggle = (lessonId: number, isLocked: boolean) => {
    if (!classroomId) return;
    updateLockMutation.mutate({
      lessonId,
      classroomId,
      is_locked: !isLocked,
    });
  };

  const teacherPov = (lesson: LessonType) => {
    const isLocked = lesson.is_locked === 1;
    const label = isLocked ? 'Unlock' : 'Lock';
    const Icon = isLocked ? Unlock : Lock;

    return (
      <div className="flex gap-1 flex-wrap">
        <Button size="sm" variant="red" onClick={() => handleLockToggle(lesson.id, isLocked)} className="  shadow-sm rounded-lg ">
          {label} <Icon size={14} />
        </Button>
        <Link to={`/teacher/courses/classes/${classroomId}/lessons/${lesson.id}/records`}>
          <Button size="sm" className=" text-white shadow-sm rounded-lg  ">
            Records
          </Button>
        </Link>

        <Link to={`/teacher/courses/${courseId}/lessons/${lesson?.id}`}>
          <Button variant={'black'} size="sm" className=" text-white shadow-sm rounded-lg  ">
            View
          </Button>
        </Link>
      </div>
    );
  };

  const studentPov = (lesson: LessonType) => {
    if (lesson.is_locked === 1) {
      return (
        <Button size="sm" disabled variant="red" className="text-gray-500 bg-gray-200 rounded-full">
          Locked <Lock size={14} className="ml-1" />
        </Button>
      );
    }

    return (
      <Link to={`/student/enrolls/${enrollId}/lessons/${lesson.id}`}>
        <Button variant={'red'} className="   text-white  shadow-md rounded-full">
          Start <Rocket size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </Link>
    );
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm shadow-xl p-6 md:p-8">
      <CardTitle className="text-xl mb-3 font-semibold text-gray-800  flex items-center gap-2">
        <BookOpen size={22} />
        Learning Your Journey
        <Star className="text-yellow-400 fill-yellow-400   ml-1 rotate-12" size={22} />
      </CardTitle>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full bg-primary/90 p-4 mb-4">
                <BookOpen className="size-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold">No lessons available at the moment</h4>
            </div>
          ) : (
            lessons.map((lesson, index) => {
              const isLocked = lesson.is_locked === 1;
              return (
                <div
                  key={lesson.id}
                  className={`group flex cursor-pointer flex-wrap gap-2 flex-row  items-center justify-between p-4 rounded-2xl border  hover:-translate-y-1 transform duration-300  shadow-sm transition-all duration-200 
                  ${isLocked && isTeacher === 0 ? 'bg-gray-50 opacity-75' : 'bg-white hover:border-primary/30 hover:shadow-md'}`}
                >
                  <div className="flex flex-1  items-center gap-3 w-auto mb-4 md:mb-0">
                    <div className="flex flex-col items-center justify-center h-10 w-10 rounded-xl bg-primary/5 text-primary border border-primary/10">
                      <span className="text-base lg:text-md font-black leading-none">{index + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-700 truncate group-hover:text-primary transition-colors">{lesson.title}</h3>
                    </div>
                  </div>

                  <div className="w-auto justify-end ml-auto flex items-center  ">{isTeacher === 1 ? teacherPov(lesson) : studentPov(lesson)}</div>
                </div>
              );
            })
          )}
        </div>

        {lessons.length > 0 && (
          <div className="mt-7 text-center">
            <p className="text-gray-600 text-sm font-semibold flex items-center justify-center gap-2">
              <Sparkles className="text-primary" size={16} />
              Every lesson is a new adventure <Sparkles className="text-primary" size={16} />           {' '}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
