'';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
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
import { Edit, Plus, Trash2, Youtube, Calendar, Clock, User } from 'lucide-react';
import { ClassroomForm } from '@/components/Form/ClassroomForm';
import { LessonForm } from '@/components/Form/LessonForm';
import { deleteLesson } from '@/services/lessonService';
import type { LessonPayloadType, LessonType } from '@/types/lesson';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users } from 'lucide-react';
import moment from 'moment';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassRoomType | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Lesson states
  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonType | null>(null);
  const [lessonConfirmOpen, setLessonConfirmOpen] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState<number | null>(null);

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
    start: '',
    end: '',
    start_time: '',
    end_time: '',
    is_active: true,
    zoom_link: '',
  };

  const [form, setForm] = useState<ClassRoomPayloadType>(defaultForm);

  const defaultLessonForm: LessonPayloadType = {
    course_id: courseId,
    title: null,
    description: null,
    youtube_link: null,
  };

  const [lessonForm, setLessonForm] = useState<LessonPayloadType>(defaultLessonForm);

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

  const displayTime = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    if (!hours || !minutes) return '';
    return `${parseInt(hours, 10)}:${minutes.padStart(2, '0')}`;
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
      zoom_link: c.zoom_link,
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

  const openCreateLesson = () => {
    setEditingLesson(null);
    setLessonForm(defaultLessonForm);
    setLessonFormOpen(true);
  };

  const openEditLesson = (lesson: LessonType) => {
    setEditingLesson(lesson);
    setLessonForm({
      course_id: lesson.course_id,
      title: lesson.title,
      description: lesson.description,
      youtube_link: lesson.youtube_link,
    });
    setLessonFormOpen(true);
  };

  const askDeleteLesson = (id: number) => {
    setDeletingLessonId(id);
    setLessonConfirmOpen(true);
  };

  const handleLessonFormSuccess = () => {
    setLessonFormOpen(false);
    setEditingLesson(null);
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
            <BreadcrumbPage className="text-base md:text-md">{course?.title ?? 'Detail'}</BreadcrumbPage>
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
          {/* Course  */}
          <Card className="border-0 shadow-xl  bg-white/80 p-4 backdrop-blur overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start gap-4">
              <div className="w-full h-56 px-2 lg:w-120 lg:h-56">
                {course?.image ? (
                  <img
                    src={course?.image as any} 
                    alt={course?.title || 'Course image'} 
                    className="w-full h-full object-cover  mx-auto  rounded-xl px-1 py-1 " 
                  />
                ) : (
                  <div className="w-full h-full lg:w-66 lg:h-52 flex items-center justify-center shadow-md mx-auto border rounded-xl border-primary bg-primary/10 text-primary">
                    <span className="text-5xl font-bold">{(course?.title?.[0] ?? 'C').toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="w-full  space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap space-y-2 items-center justify-between ">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">{course?.title}</h2>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="primary" size="sm" className=" gap-2">
                        <Link to={`/teacher/courses/edit?id=${courseId}`}>
                          <Edit className="size-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground line-clamp-6 text-base leading-relaxed " dangerouslySetInnerHTML={{ __html: course?.description || 'No description available' }}></p>
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
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs">{course.price} MMK</span>
                    </div>
                  )}
                  {typeof course?.status !== 'undefined' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${course?.status == 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                      >
                        {course?.status == 1 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs  */}
          <Card className="border-0 shadow-xl mt-0 pt-0 bg-white/80 backdrop-blur overflow-hidden">
            <Tabs defaultValue="classrooms" className="w-full">
              <div className="border-b bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-5">
                <TabsList className=" rounded-2xl bg-white  shadow  h-11">
                  <TabsTrigger
                    value="classrooms"
                    className="gap-2 rounded-xl transition-all  duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
                  >
                    <Users className="size-4" />
                    <span className="font-medium">Class Rooms</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="lessons"
                    className="gap-2   rounded-xl transition-all  duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
                  >
                    <BookOpen className="size-4" />
                    <span className="font-medium">Lessons</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Class  */}
              <TabsContent value="classrooms" className="p-6 space-y-6 mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Class Rooms</h3>
                    <p className="text-sm text-muted-foreground mt-1">Manage class schedules and sessions</p>
                  </div>
                  <Button disabled={course?.lessons.length === 0} type="button" className="gap-2 shadow-sm w-full sm:w-auto" onClick={openCreate}>
                    <Plus className="size-4" /> Create Class Room
                  </Button>
                </div>

                <div className="min-h-[200px]">
                  {!course?.class_rooms || course?.class_rooms?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <div className="rounded-full bg-primary/90 p-4 mb-4">
                        <Users className="size-8 text-white " />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">No class rooms yet</h4>
                      <p className="text-sm text-muted-foreground mb-4">Create your first class room to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {course?.class_rooms?.map((c) => (
                        <Card key={c.id} className="group relative overflow-hidden transition-all duration-200 hover:shadow ">
                          <div className="p-5 flex flex-col gap-5">
                            <div className="space-y-3">
                              <div className="flex items-center flex-wrap justify-between">
                                <h4 className="font-semibold  flex-1 text-base lg:text-lg text-foreground leading-tight">{c?.class_name}</h4>
                                <div className="flex items-center gap-2">
                                  <Button variant="primary" onClick={() => openEdit(c)}>
                                    <Edit className="size-4" />
                                  </Button>
                                  <Button variant="destructive" onClick={() => askDelete(c.id)}>
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <span
                              className={`inline-flex absolute right-3 top-3 items-center rounded-full px-2 py-0.5 text-xs font-medium ${c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                } `}
                            >
                              {c.is_active ? 'Active' : 'Inactive'}
                            </span>

                            <div className="space-y-4">
                              <div className="grid grid-cols-1 gap-3">
                                {/* Duration */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50  border border-blue-100 ">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100  flex items-center justify-center">
                                    <Calendar className="size-4 text-blue-600 " />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-blue-700  uppercase tracking-wide mb-0.5">Duration</div>
                                    <div className="text-sm font-semibold text-blue-900 truncate">
                                      {moment(c.start).format('MMM DD')} - {moment(c.end).format('MMM DD, YYYY')}
                                    </div>
                                  </div>
                                </div>

                                {/* Time */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 0  border border-purple-100 ">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Clock className="size-4 text-purple-600 " />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-purple-700  uppercase tracking-wide mb-0.5">Time</div>
                                    <div className="text-sm font-semibold text-purple-900  truncate">
                                      {displayTime(c.start_time)} - {displayTime(c.end_time)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {c.teacher && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50  border border-green-100 ">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100  flex items-center justify-center">
                                    <User className="size-4 text-green-600 " />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-green-700 uppercase tracking-wide mb-0.5">Teacher</div>
                                    <div className="text-sm font-semibold text-green-900 truncate">
                                      {c.teacher.first_name} {c.teacher.last_name}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col lg:flex-row items-center border-t pt-3 w-full gap-2">
                              <Button asChild className="gap-2 w-full lg:w-[50%] bg-primary/75 hover:scale-100 ">
                                <Link to={`/teacher/courses/classes/${c?.id}`}>
                                  View
                                </Link>
                              </Button>

                              {c?.zoom_link && (
                                <Button asChild variant="primary" className="group/link rounded-xl  text-center w-full lg:w-[50%] flex items-center gap-2">
                                  <a href={c.zoom_link} target="_blank" rel="noopener noreferrer">
                                    Join Zoom
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Lessons  */}
              <TabsContent value="lessons" className="p-6 space-y-6 mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Lessons</h3>
                    <p className="text-sm text-muted-foreground mt-1">Manage course lessons and materials</p>
                  </div>
                  <Button type="button" className="gap-2 shadow-sm w-full sm:w-auto" onClick={openCreateLesson}>
                    <Plus className="size-4" /> Create Lesson
                  </Button>
                </div>

                <div className="min-h-[200px]">
                  {!course?.lessons || course?.lessons?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <div className="rounded-full  bg-primary/90 p-4 mb-4">
                        <BookOpen className="size-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">No lessons yet</h4>
                      <p className="text-sm text-muted-foreground mb-4">Create your first lesson to start teaching</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {course?.lessons?.map((lesson) => (
                        <Card key={lesson.id} className="group relative overflow-hidden transition-all duration-200 hover:shadow">
                          <div className=" p-5 flex flex-col gap-5">
                            <div className="flex items-center justify-between gap-3">
                              <h4 className="font-semibold  flex-1 text-base lg:text-lg text-foreground leading-tight">{lesson?.title}</h4>

                              <div className="flex items-center gap-2">
                                <Button variant="primary" onClick={() => openEditLesson(lesson)}>
                                  <Edit className="size-4" />
                                </Button>
                                <Button variant="destructive" onClick={() => askDeleteLesson(lesson.id)}>
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </div>

                            {lesson?.description && (
                              <p className="text-sm text-muted-foreground  overflow-auto max-h-[300px]   leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.description }}></p>
                            )}

                            {lesson?.youtube_link && (
                              <div className="flex  w-full gap-2 pt-4 border-t  ">
                                {lesson?.youtube_link && (
                                  <Button asChild variant="destructive" className="group/link w-full flex items-center rounded-xl gap-2">
                                    <a href={lesson.youtube_link} target="_blank" rel="noopener noreferrer">
                                      <Youtube className="size-4" />
                                      YouTube
                                    </a>
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}

      {/* delete class */}
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

      {/* class form */}
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

      {/* lesson form */}
      <LessonForm
        open={lessonFormOpen}
        onOpenChange={setLessonFormOpen}
        editingItem={editingLesson}
        courseId={courseId}
        form={lessonForm}
        setForm={setLessonForm}
        onSuccess={handleLessonFormSuccess}
      />

      {/* lesson delete */}
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
