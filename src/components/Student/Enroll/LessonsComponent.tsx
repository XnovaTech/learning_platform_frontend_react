import { BookOpen, Lock, Unlock, Sparkles, Star, Trophy, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
}

export function LessonsComponent({ lessons = [], enrollId, isTeacher = 0, classroomId }: LessonComponentProps) {
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
      <div className="flex gap-1.5 flex-wrap">
        <Button size="sm" variant="red" onClick={() => handleLockToggle(lesson.id, isLocked)} className="  shadow-sm rounded-full">
          {label} <Icon size={14} className="ml-1" />
        </Button>
        <Link to={`/teacher/courses/classes/${classroomId}/lessons/${lesson.id}/records`}>
          <Button size="sm" className=" text-white shadow-sm rounded-full ">
            Records
          </Button>
        </Link>
      </div>
    );
  };

  const studentPov = (lesson: LessonType) => {
    if (lesson.is_locked === 1) {
      return (
        <Button size="sm" disabled variant="secondary" className="text-gray-500 bg-gray-200 rounded-full">
          <Lock size={14} className="mr-1.5" /> Locked
        </Button>
      );
    }

    return (
      <Link to={`/student/enrolls/${enrollId}/lessons/${lesson.id}`}>
        <Button variant={'red'} className="   text-white shadow-md rounded-full">
          Start <Rocket size={14} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
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
        <div className="relative">
          {lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full bg-primary/90 p-4 mb-4">
                <BookOpen className="size-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold">No Lessons Available </h4>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {lessons.map((lesson, index) => {
                const isLocked = lesson.is_locked === 1;

                return (
                  <Card
                    key={lesson.id}
                    className="group relative overflow-hidden border-primary/10 bg-primary/2   transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
                  >
                    {/* locked comming soon */}
                    {isLocked && isTeacher === 0 && (
                      <div className="absolute inset-0 bg-gray-100/70 backdrop-blur-[3px] z-10 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Lock className="mx-auto text-gray-400 mb-1" size={32} />
                          <p className="text-gray-600 font-semibold text-sm">Coming Soon</p>
                        </div>
                      </div>
                    )}

                    <div className="flex px-4 flex-wrap  lg:py-2 items-start lg:items-center gap-3 flex-col lg:flex-row">
                      <Badge
                        className={`shrink-0 bg-gradient-to-r  from-primary/70 via-primary/80 to-primary/90 text-white font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-sm hover:bg-primary`}
                      >
                        <Trophy size={14} />
                        <span>Lesson {index + 1}</span>
                      </Badge>

                      <div className="lg:flex-1 min-w-0">
                        <h3 className={`text-base lg:text-lg font-semibold  bg-clip-text text-primary  truncate  `}>{lesson.title}</h3>
                      </div>

                      <div className="shrink-0 self-end lg:self-center">{isTeacher === 1 ? teacherPov(lesson) : studentPov(lesson)}</div>
                    </div>

                    {/* hover-state */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {lessons.length > 0 && (
          <div className="mt-7 text-center">
            <p className="text-gray-600 text-sm font-semibold flex items-center justify-center gap-2">
              <Sparkles className="text-primary" size={16} />
              Every lesson is a new adventure
              <Sparkles className="text-primary" size={16} />
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
