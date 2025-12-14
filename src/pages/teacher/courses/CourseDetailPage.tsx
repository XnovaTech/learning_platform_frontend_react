import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ConfirmDialog } from '@/components/ui/dialog-context-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { toast } from 'sonner';
import { getCourse } from '@/services/courseService';
import { deleteClassRoom } from '@/services/classService';
import type { ClassRoomPayloadType, ClassRoomType } from '@/types/class';
import type { CourseType } from '@/types/course';
import { Plus } from 'lucide-react';
import { ClassroomForm } from '@/components/Form/ClassroomForm';
import { deleteLesson, lessonDetail } from '@/services/lessonService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users } from 'lucide-react';
import ClassRoomTable from '@/components/Table/ClassRoomTable';
import LessonTable from '@/components/Table/LessonTable';
import CourseCard from '@/components/Card/CourseCard';

export default function CourseDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const courseId = Number(params.id);
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<number | null>(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassRoomType | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('classrooms');
  const [lessonConfirmOpen, setLessonConfirmOpen] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState<number | null>(null);
  const statusTabValue = statusFilter === 1 ? 'active' : 'inactive';

  const { data: course, isLoading } = useQuery<CourseType>({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId),
    enabled: !Number.isNaN(courseId),
    refetchOnWindowFocus: false,
  });

  const defaultForm: ClassRoomPayloadType = {
    course_id: courseId,
    teacher_id: null,
    class_name: null,
    start: null,
    end: null,
    start_time: null,
    end_time: null,
    is_active: true,
    is_finish: false,
    zoom_link: '',
    days: [],
  };

  const [form, setForm] = useState<ClassRoomPayloadType>(defaultForm);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteClassRoom(id),
    onSuccess: async () => {
      toast.success('Class deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      setConfirmOpen(false);
      setDeletingId(null);
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete class!'),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (id: number) => deleteLesson(id),
    onSuccess: async () => {
      toast.success('Lesson deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      setLessonConfirmOpen(false);
      setDeletingLessonId(null);
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete lesson!'),
  });

  const formatTimeToHi = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    if (!hours || !minutes) return '';
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm(defaultForm);
    setFormOpen(true);
  };

  const openEdit = (c: ClassRoomType) => {
    setEditingItem(c);
    setForm({
      course_id: c.course_id,
      teacher_id: c.teacher_id,
      class_name: c.class_name,
      start: c.start,
      end: c.end,
      start_time: c.start_time,
      end_time: c.end_time,
      is_active: c.is_active,
      is_finish: c.is_finish,
      zoom_link: c.zoom_link,
      days: c.days,
    });
    setFormOpen(true);
  };

  const askDelete = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  const askDeleteLesson = (id: number) => {
    setDeletingLessonId(id);
    setLessonConfirmOpen(true);
  };

  const editLesson = (lesson: any) => {
    queryClient.prefetchQuery({
      queryKey: ['lesson', lesson.id],
      queryFn: () => lessonDetail(lesson.id),
    });

    navigate(`/teacher/courses/lessons/${lesson.id}/edit`);
  };

  return (
    <div className="max-w-9xl p-4 mx-auto space-y-6">
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
              <Link className="text-base md:text-md" to="/teacher/courses" prefetch="intent">
                Courses
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md">{course?.title ?? 'Detail'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur p-6">
          <div className="flex items-center justify-center py-14">
            <Spinner className="text-primary size-7 md:size-8" />
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          <CourseCard courseId={courseId} course={course} isTeacher={true} />

          <Card className="border-0 shadow-xl mt-0 pt-0 bg-white/80 backdrop-blur overflow-hidden">
            <Tabs defaultValue="classrooms" className="w-full" onValueChange={setActiveTab}>
              <div className="border-b bg-linear-to-r from-slate-50 to-slate-100/50 px-6 py-5 flex items-center justify-between">
                <TabsList className=" rounded-2xl bg-white  shadow  h-11">
                  <TabsTrigger
                    value="classrooms"
                    className="gap-2 rounded-xl transition-all duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
                  >
                    <Users className="size-4" />
                    <span className="font-medium">Class Rooms</span>
                  </TabsTrigger>
                  <TabsTrigger value="lessons" className="gap-2 rounded-xl transition-all duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
                    <BookOpen className="size-4" />
                    <span className="font-medium">Lessons</span>
                  </TabsTrigger>
                </TabsList>

                {activeTab === 'classrooms' && (
                  <Button disabled={course?.lessons.length === 0} type="button" className="gap-2 shadow-sm w-full sm:w-auto" onClick={openCreate}>
                    <Plus className="size-4" /> Create Class Room
                  </Button>
                )}
              </div>

              <TabsContent value="classrooms" className="p-6 space-y-6 mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Class Rooms</h3>
                    <p className="text-sm text-muted-foreground mt-1">Manage class schedules and sessions</p>
                  </div>

                  <Tabs
                    value={statusTabValue}
                    onValueChange={(value) => {
                      if (value === 'active') {
                        setStatusFilter(1);
                      } else {
                        setStatusFilter(0);
                      }
                    }}
                    className="w-full sm:w-auto"
                  >
                    <TabsList className="rounded-2xl bg-white shadow h-10">
                      <TabsTrigger
                        value="active"
                        className="rounded-xl transition-all capitalize duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5.5"
                      >
                        Active
                      </TabsTrigger>
                      <TabsTrigger
                        value="inactive"
                        className="rounded-xl transition-all capitalize duration-300 cursor-pointer data-[state=active]:bg-red-600 data-[state=active]:text-primary-foreground px-5.5"
                      >
                        Inactive
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <ClassRoomTable classrooms={course?.class_rooms?.filter((c) => c?.is_active == statusFilter) || []} onEdit={openEdit} onDelete={askDelete} isCoureDetail={true} />
              </TabsContent>

              <TabsContent value="lessons" className="p-6 space-y-6 mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Lessons</h3>
                    <p className="text-sm text-muted-foreground mt-1">Manage course lessons and materials</p>
                  </div>

                  <Button type="button" className="gap-2 shadow-sm w-full sm:w-auto" asChild>
                    <Link to={`/teacher/courses/${courseId}/lessons/create`}>
                      <Plus className="size-4" /> Create Lesson
                    </Link>
                  </Button>
                </div>

                <LessonTable lessons={course?.lessons || []} onEdit={editLesson} onDelete={askDeleteLesson} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Class?"
        description="This action cannot be undone. The class will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        destructive
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingId(null);
        }}
        onConfirm={() => {
          if (deletingId != null) deleteMutation.mutate(deletingId);
        }}
      />

      <ClassroomForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editingItem={editingItem}
        courseId={courseId}
        form={form}
        setForm={setForm}
        onSuccess={handleFormSuccess}
        formatTimeToHi={formatTimeToHi}
      />

      <ConfirmDialog
        open={lessonConfirmOpen}
        onOpenChange={setLessonConfirmOpen}
        title="Delete Lesson?"
        description="This action cannot be undone. The lesson will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLessonMutation.isPending}
        destructive
        onCancel={() => {
          setLessonConfirmOpen(false);
          setDeletingLessonId(null);
        }}
        onConfirm={() => {
          if (deletingLessonId != null) deleteLessonMutation.mutate(deletingLessonId);
        }}
      />
    </div>
  );
}
