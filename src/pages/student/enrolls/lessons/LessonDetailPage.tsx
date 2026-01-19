import { useQuery } from '@tanstack/react-query';
import { getLessonByStudent } from '@/services/lessonService';
import type { LessonType } from '@/types/lesson';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import ReactPlayer from 'react-player';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LessonTaskComponent from '@/components/Student/Enroll/Tasks/LessonTaskComponent';
import LessonCard from '@/components/Card/LessonCard';
import { BookOpenCheck, Video, Users, BookOpen, Home } from 'lucide-react';

export default function LessonDetailPage() {
  // const { enrollId, lessonId } = use(params);
  const params = useParams();
  const lessonID = Number(params.lessonId);
  const enrollID = Number(params.enrollId);

  const { data: lesson, isLoading } = useQuery<LessonType>({
    queryKey: ['lesson', lessonID],
    queryFn: () => getLessonByStudent(lessonID),
    enabled: !Number.isNaN(lessonID),
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur p-8 flex items-center justify-center h-[60vh]">
        <Spinner className="text-primary size-8" />
      </Card>
    );
  }

  return (
    <div className=" w-full mx-auto max-w-8xl py-5 space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to="/student/home">
                <Home className="size-4" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to={`/student/enrolls/${enrollID}`}>
                <Users className="size-4" />
                ClassRoom
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md gap-2">
              <BookOpen className="size-4" />
              {lesson?.title ?? 'Detail'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <LessonCard lesson={lesson} />

      <Tabs defaultValue="youtube" className="w-full max-w-8xl mx-auto my-4">
        <TabsList className="flex flex-wrap justify-center gap-2 md:gap-6  bg-white/50 backdrop-blur-lg drop-shadow-2xl rounded-xl p-2 h-12.5">
          <TabsTrigger value="youtube" className="px-4 py-2 gap-2  font-medium rounded-xl transition-all hover:bg-primary-100 data-[state=active]:bg-ocean data-[state=active]:text-white">
            <Video className="size-4" />
            Lesson Video
          </TabsTrigger>

          <TabsTrigger value="tasks" className="px-4 py-2  gap-2 font-medium rounded-xl transition-all hover:bg-primary-100 data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            <BookOpenCheck className="size-4" />
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="youtube" className="w-full mt-6">
          <div className=" bg-white/50 backdrop-blur-lg rounded-2xl shadow-xl space-y-4 p-2 md:p-8">
            {lesson?.youtube_link ? (
              <div className=" aspect-video rounded-xl overflow-hidden drop-shadow-md border border-gray-200 dark:border-gray-700">
                <ReactPlayer
                  src={lesson.youtube_link}
                  className="react-player"
                  width="100%"
                  height="100%"
                  controls
                  style={{ borderRadius: '1rem' }}
                  config={{
                    youtube: {
                      playerVars: {
                        rel: 0,
                        showinfo: 0,
                        height: '100%',
                        modestbranding: 1,
                        disablekb: 1,
                        fs: 0,
                      },
                    } as any,
                  }}
                />
              </div>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-300 py-10 text-lg">No video available for this lesson.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="tasks" className="mt-3 w-full">
          <LessonTaskComponent lessonId={lessonID} enrollId={enrollID} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
