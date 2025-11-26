import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { Edit, User2 } from 'lucide-react';

interface CourseTypeProps {
  course?: any;
  courseId?: number;
  isTeacher?: boolean;
  teacherName?:string;
}

export default function CourseCard({ course, courseId, isTeacher = false ,teacherName}: CourseTypeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <Card className="border-0 shadow-xl bg-white/80 p-4 backdrop-blur overflow-hidden">
        <div className={`flex flex-col ${isExpanded ? 'lg:flex-col' : 'lg:flex-row'}  items-start gap-4`}>
          <div className={`w-full h-56 px-2 ${isExpanded ? 'lg:w-full' : 'lg:w-120'}  lg:h-60`}>
            {course?.image ? (
              <img src={course?.image as any} alt={course?.title || 'Course image'} className="w-full h-full object-cover mx-auto rounded-xl px-1 py-1" />
            ) : (
              <div className="w-full h-full lg:w-66 lg:h-52 flex items-center justify-center shadow-md mx-auto border rounded-xl border-primary bg-primary/10 text-primary">
                <span className="text-5xl font-bold">{(course?.title?.[0] ?? 'C').toUpperCase()}</span>
              </div>
            )}
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap space-y-2 items-center justify-between ">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">{course?.title}</h2>
                {isTeacher ? (
                  <div className="flex items-center gap-2">
                    <Button asChild variant="primary" size="sm" className="gap-2">
                      <Link to={`/teacher/courses/edit?id=${courseId}`}>
                        <Edit className="size-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                    </Button>
                  </div>
                ) : ( 
                  <div className="flex flex-wrap items-center justify-end gap-3 ">
                    <div className="bg-primary/80 flex flex-row px-3 py-1.5 text-sm rounded-full shadow gap-3">
                      <User2 className=" w-7 h-7 p-2 bg-white/70 rounded-full" />
                      <p className=" font-semibold text-white mt-1">Tr.{teacherName}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative space-y-2">
                <div
                  className={`text-muted-foreground text-base leading-relaxed transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[2000px]' : 'max-h-32'}`}
                  dangerouslySetInnerHTML={{ __html: course?.description || '' }}
                />

                {course?.description && (
                  <Button
                    variant="link"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="text-primary float-right text-sm transition-all  p-0 font-medium hover:underline underline-offset-1 mt-1"
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              {course?.category?.name && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs">{course?.category.name}</span>
                </div>
              )}

              {course?.price != null && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Fee:</span>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs">{course.price?.toLocaleString()} MMK</span>
                </div>
              )}

              {typeof course?.status !== 'undefined' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${course?.status == 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {course?.status == 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
