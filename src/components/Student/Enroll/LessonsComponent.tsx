import { Button } from '@/components/ui/button';
import { updateLockState } from '@/services/lessonService';
import type { LessonLockType, LessonType } from '@/types/lesson';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, BookOpen, Lock, Unlock } from 'lucide-react';
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
      <>
      <Button variant="default" onClick={() => handleLockToggle(lesson.id, isLocked)} className="cursor-pointer hover:bg-white/50 text-orange-800 bg-white font-semibold gap-2 text-sm rounded-2xl mr-2">
        {label} <Icon size={16} />
      </Button>

      <Link to={`/teacher/courses/classes/${classroomId}/lessons/${lesson.id}/records`}>
      <Button variant="default">Task Records</Button>
      </Link>
      </>
    );
  };

  const studentPov = (lesson: LessonType) => {
    if (lesson.is_locked === 1) {
      return (
        <Button size="sm" disabled className="text-gray-500 bg-gray-100 font-semibold gap-2 text-sm rounded-2xl cursor-not-allowed">
          Locked <Lock size={16} />
        </Button>
      );
    }

    return (
      <Link to={`/student/enrolls/${enrollId}/lessons/${lesson.id}`}>
        <Button variant="default" className="gap-2">
          Enter <ArrowRight size={16} />
        </Button>
      </Link>
    );
  };

  return (
    <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-xl space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <BookOpen className="text-primary" size={22} />
        Lessons
      </h2>

      <ul className="grid grid-cols-1 gap-5">
        {lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full bg-primary/90 p-4 mb-4">
              <BookOpen className="size-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-1">No Lessons Found</h4>
          </div>
        ) : (
          lessons?.map((lesson, index) => (
            <li key={lesson.id} className="group relative bg-ocean/10 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 hover:-translate-y-1">
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">Lesson - {index + 1}</h3>

                <div className="flex gap-4">
                  <p className="text-gray-600 flex-1 group-hover:text-primary transition-colors">{lesson.title}</p>

                  <div className="flex justify-end">
                    {isTeacher === 1 ? teacherPov(lesson) : studentPov(lesson)}
                   
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-primary/10 to-primary/5 pointer-events-none" />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
