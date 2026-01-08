import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Users, Calendar, Clock, BookOpen, CalendarDays, Video, User2, BookOpenCheck } from 'lucide-react';
import moment from 'moment';
import type { ClassRoomType } from '@/types/class';
import { deleteClassConversations, getClass } from '@/services/classService';
import { DiscussionComponent } from '@/components/Student/Enroll/DiscussionComponent';
import { useAuth } from '@/context/AuthContext';
import { ClassMateComponent } from '@/components/Student/Enroll/ClassMateComponent';
import { LessonsComponent } from '@/components/Student/Enroll/LessonsComponent';
import { ZoomRoomComponent } from '@/components/Student/Enroll/ZoomRoomComponent';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { downloadCertificates } from '@/services/userCertificateService';
import { displayTime } from '@/utils/format';
import ClassExamsList from '@/components/Exams/ClassExamsList';

export default function ClassDetailPage() {
  const { id } = useParams();
  const classId = Number(id);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: classroom, isLoading } = useQuery<ClassRoomType>({
    queryKey: ['classes', classId],
    queryFn: () => getClass(classId),
    enabled: !Number.isNaN(classId),
  });



  const deleteConversationMutation = useMutation({
    mutationFn: (id: number) => deleteClassConversations(id),
    onSuccess: async (_, classId) => {
      toast.success('Deleted conversation successfully');
      await queryClient.invalidateQueries({ queryKey: ['classes', classId] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete conversation!'),
  });

  const downloadMutation = useMutation({
    mutationFn: () => downloadCertificates(classroom?.id!, classroom?.class_name ?? 'class'),
    onSuccess: () => {
      toast.success('Downloaded Certificates Successfully');
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to download student certificates');
    },
  });

  const handleGenerate = () => {
    deleteConversationMutation.mutate(classId);
    downloadMutation.mutate();
  };

 
  return (
    <div className="max-w-9xl p-4 mx-auto space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md" to="/teacher/dashboard">
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md" to="/teacher/courses">
                Courses
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md" to={`/teacher/courses/${classroom?.course?.id}`}>
                {classroom?.course?.title || 'Course'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md">{classroom?.class_name || 'Class Detail'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? (
        <Card className="border-0 shadow-xl bg-white/80  backdrop-blur p-6">
          <div className="flex items-center justify-center py-14">
            <Spinner className="text-primary size-7 md:size-8" />
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          <Card className="border-0 shadow-xl bg-white/80 p-6 backdrop-blur overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{classroom?.class_name}</h1>
                      <span
                        className={`inline-flex items-center text-xs rounded-full px-2 py-0.5  font-medium ${
                          classroom?.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        } `}
                      >
                        {classroom?.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center  gap-3 ">
                      {classroom?.is_finish == 1 && (
                        <Button className="hover:scale-100  rounded-2xl" size="sm" variant={'red'} onClick={handleGenerate}>
                          {downloadMutation.isPending ? 'Processing...' : 'Generate'}
                        </Button>
                      )}
                      <div className="bg-primary/80 flex flex-row px-2 py-1 text-sm rounded-full shadow gap-3">
                        <User2 className=" w-7 h-7 p-2 bg-white/70 rounded-full" />
                        <p className=" font-medium text-white mt-1">Tr.{classroom?.teacher.first_name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2   gap-4">
                  {/* Duration */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="size-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">Duration</div>
                      <div className="text-sm font-semibold text-blue-900">
                        {moment(classroom?.start).format('MMM DD')} - {moment(classroom?.end).format('MMM DD, YY')}
                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-linear-to-r from-purple-50 to-pink-50 border border-purple-100">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Clock className="size-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-purple-700 uppercase tracking-wide mb-1">Time</div>
                      <div className="text-sm font-semibold text-purple-900">
                        {displayTime(classroom?.start_time)} - {displayTime(classroom?.end_time)}
                      </div>
                    </div>
                  </div>

                  {/* Students */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-linear-to-r from-orange-50 to-red-50 border border-orange-100">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Users className="size-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-orange-700 uppercase tracking-wide mb-1">Students</div>
                      <div className="text-sm font-semibold text-orange-900">{classroom?.class_mates?.length || 0} Enrolled</div>
                    </div>
                  </div>

                  {classroom?.teacher && (
                    <div className="flex capitalize items-center gap-3 p-4 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 border border-green-100">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <CalendarDays className="size-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">Days</div>
                        <div className="text-sm font-semibold text-green-800 flex flex-wrap gap-1.5">
                          {classroom?.days?.map((day, index) => (
                            <span key={day} className="text-sm capitalize" title={day}>
                              {day}
                              {index < classroom?.days.length - 1 && ','}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs  */}
          <Tabs defaultValue="lessons" className="w-full">
            <TabsList className=" rounded-2xl bg-white  shadow  h-11">
              <TabsTrigger value="lessons" className="gap-2 rounded-xl transition-all  duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
                <BookOpen className="size-4" />
                <span className="font-medium">Lessons</span>
              </TabsTrigger>

              <TabsTrigger value="classmates" className="gap-2 rounded-xl transition-all  duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
                <Users className="size-4" />
                <span className="font-medium">Class Mates</span>
              </TabsTrigger>
              <TabsTrigger
                value="discussion"
                className="gap-2   rounded-xl transition-all  duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
              >
                <MessageCircle className="size-4" />
                <span className="font-medium">Discuss Room</span>
              </TabsTrigger>

              <TabsTrigger value="zoom" className="gap-2   rounded-xl transition-all  duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
                <Video className="size-4" />
                <span className="font-medium">Join Zoom</span>
              </TabsTrigger>

              <TabsTrigger value="exams" className="gap-2   rounded-xl transition-all  duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
                <BookOpenCheck className="size-4" />
                <span className="font-medium">Exams</span>
              </TabsTrigger>
            </TabsList>

            {/* Lesssons */}
            <TabsContent value="lessons" className="py-4 space-y-6 mt-0">
              <LessonsComponent lessons={classroom?.lessons} isTeacher={1} classroomId={classroom?.id} />
            </TabsContent>

            {/* Class Mates  */}
            <TabsContent value="classmates" className="py-4 space-y-6 mt-0">
              <ClassMateComponent classMates={classroom?.class_mates} />
            </TabsContent>

            {/* Discussion   */}
            <TabsContent value="discussion" className="py-4 space-y-6 mt-0">
              <DiscussionComponent classId={classroom?.id as number} userId={user?.id} />
            </TabsContent>

            {/* Zoom   */}
            <TabsContent value="zoom" className="py-4 space-y-6 mt-0">
              <ZoomRoomComponent zoomLink={classroom?.zoom_link} />
            </TabsContent>

            {/* Exam   */}
            <TabsContent value="exams" className="py-4 space-y-6 mt-0">
              <ClassExamsList exams={classroom?.exams || []} classId={classId} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
