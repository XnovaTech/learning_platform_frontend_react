import { useQuery } from '@tanstack/react-query';
import { enrollDetail } from '@/services/enrollService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { EnrollType } from '@/types/enroll';
import { LessonsComponent } from '@/components/Student/Enroll/LessonsComponent';
import { ClassMateComponent } from '@/components/Student/Enroll/ClassMateComponent';
import { DiscussionComponent } from '@/components/Student/Enroll/DiscussionComponent';
import { ZoomRoomComponent } from '@/components/Student/Enroll/ZoomRoomComponent';
import { useStudentData } from '@/context/StudentDataContext';
import { useParams } from 'react-router-dom';
import CourseCard from '@/components/Card/CourseCard';

export default function EnrollDetailPage() {
  const { enrollId } = useParams();
  const enrollID = Number(enrollId);
  const { studentData } = useStudentData();
  const studentId = studentData?.id;

  const { data: enroll, isLoading } = useQuery<EnrollType>({
    queryKey: ['enroll', enrollId],
    queryFn: () => enrollDetail(enrollID),
    enabled: !Number.isNaN(enrollId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return (
    <>
      {isLoading ? (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6">
          <div className="flex items-center justify-center py-14">
            <Spinner className="text-primary size-7 md:size-8" />
          </div>
        </Card>
      ) : (
        <>
          <CourseCard course={enroll?.class_room?.course} teacherName={enroll?.class_room?.teacher?.first_name} days={enroll?.class_room?.days} />

          <Tabs defaultValue="lessons" className="w-full max-w-8xl mx-auto my-6">
            {/* Tab List */}
            <TabsList className="flex flex-wrap justify-center gap-2 md:gap-6  bg-white/50 backdrop-blur-lg drop-shadow-2xl rounded-xl p-2 h-auto">
              <TabsTrigger value="lessons" className="px-4 py-2  font-medium rounded-xl transition-all hover:bg-primary/10 data-[state=active]:bg-ocean data-[state=active]:text-white">
                Lessons
              </TabsTrigger>

              <TabsTrigger value="classmates" className="px-4 py-2  font-medium rounded-xl transition-all hover:bg-primary/10 data-[state=active]:bg-sky-600 data-[state=active]:text-white">
                Classmates
              </TabsTrigger>

              <TabsTrigger value="discussion" className="px-4 py-2  font-medium rounded-xl transition-all hover:bg-primary/10 data-[state=active]:bg-sunset data-[state=active]:text-white">
                Discuss Room
              </TabsTrigger>
              <TabsTrigger value="zoom" className="px-4 py-2  font-medium rounded-xl transition-all hover:bg-primary-100 data-[state=active]:bg-sky-600 data-[state=active]:text-white">
                Live Class (Zoom)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lessons" className="mt-3">
              {/* Lessons Content */}
              <LessonsComponent lessons={enroll?.class_room?.course?.lessons} enrollId={enroll?.id} />
            </TabsContent>

            <TabsContent value="classmates" className="mt-3">
              {/* Classmates Content */}
              <ClassMateComponent classMates={enroll?.class_mates} />
            </TabsContent>

            <TabsContent value="discussion" className="mt-3">
              {/* Discussion Content */}
              {studentId && <DiscussionComponent classId={enroll?.class_room?.id as number} userId={studentId} />}
            </TabsContent>
            <TabsContent value="zoom" className="mt-3 w-full">
              <ZoomRoomComponent zoomLink={enroll?.class_room?.zoom_link} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  );
}
