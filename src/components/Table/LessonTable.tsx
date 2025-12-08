import { Button } from '@/components/ui/button';
import { BookOpen, Edit, Trash2, Youtube } from 'lucide-react';
import type { LessonType } from '@/types/lesson';
import { Link } from 'react-router-dom';

interface LessonTableProps {
  lessons: LessonType[];
  onEdit: (lesson: LessonType) => void;
  onDelete: (id: number) => void;
}

export default function LessonTable({ lessons, onEdit, onDelete }: LessonTableProps) {
  return (
    <div className="overflow-x-auto rounded-md">
      {lessons?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="rounded-full bg-primary/90 p-4 mb-4">
            <BookOpen className="size-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-1">No lessons yet</h4>
          <p className="text-sm text-muted-foreground mb-4">Create your first lesson to start teaching</p>
        </div>
      ) : (
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Title</th>
              {/* <th className="px-4 py-3 font-medium ">Description</th> */}
              <th className="px-4 py-3 font-medium">YouTube</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id} className="border-t group hover:bg-muted transition-colors">
                <td className="px-4 py-3 font-medium text-primary hover:text-primary/80 hover:underline hover:underline-offset-3 transition-colors duration-300">

                      <Link to={`/teacher/courses/${lesson?.course_id}/lessons/${lesson?.id}`}>
                             {lesson?.title}
                      </Link>
               </td>
                {/* <td className="px-4 py-3 line-clamp-2 text-muted-foreground w-[400px] lg:w-[500px] overflow-hidden" dangerouslySetInnerHTML={{ __html: lesson?.description || '' }}></td>{' '} */}
                <td className="px-4 py-3">
                  {lesson?.youtube_link ? (
                    <Button asChild variant="red" size="sm" className="gap-2 bg-red-600 ">
                      <a href={lesson.youtube_link} target="_blank" rel="noopener noreferrer">
                        <Youtube className="size-4" />
                        <span className="text-xs">Watch</span>
                      </a>
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="primary" size="sm" onClick={() => onEdit(lesson)}>
                      <Edit className="size-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(lesson.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
