import React, { useState } from 'react';
import { listCategoriesWithClassAndCourse } from '@/services/categoryService';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Loader2, Banknote, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { createEnroll } from '@/services/enrollService';
import { toast } from 'sonner';
import moment from 'moment';
import { Spinner } from '@/components/ui/spinner';
import { useStudentData } from '@/context/StudentDataContext';



export default function CoursePage() {
    const navigate = useNavigate();

    const [openItem, setOpenItem] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const { studentData, isLoading, isError, refetch } = useStudentData();
    const studentId = studentData?.id;

    const queryClient = useQueryClient();
    const createMutation = useMutation({
        mutationFn: createEnroll,
        onSuccess: async () => {
            setOpenItem(false);
            refetch();
            toast.success('We will contact you soon.');
            await queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            navigate('/student/enrolls');
        },
        onError: (e) => {
            toast.error(e?.message || 'Failed to Enroll');
        },
    });

    const {
        data: categories = [],
    } = useQuery({
        queryKey: ['categories'],
        queryFn: listCategoriesWithClassAndCourse,
        enabled: !!studentId,
    });



    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createMutation.mutateAsync({
            student_id: studentId,
            class_id: selectedClass,
        });
    };

    const handleOpen = (courseId: number) => {
        setOpenItem(true);
        setSelectedCourse(courseId);
    };

    const handleSelectClass = (classId: number) => {
        setSelectedClass(classId);
    };

    const getSelectedCourse = () => {
        for (const cat of categories) {
            const data = cat.courses?.find((course) => course.id === selectedCourse);
            if (data) return data;
        }

        return null;
    };

    const courseData = getSelectedCourse();

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-80">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-2 text-gray-600">Loading Courses ...</span>
            </div>
        );

    if (isError) return <div className="text-center text-red-500 font-medium py-10">Failed to load courses. Please try again later.</div>;

    return (
        <div className="space-y-8 py-6">
            <h2 className="text-2xl font-semibold text-gray-900 ">Let’s Explore New Courses</h2>

            {categories.length > 0 ? (
                <Tabs defaultValue={categories[0]?.name} className="w-full max-w-7xl mx-auto">
                    {/* --- Tab List --- */}
                    <TabsList className="flex flex-wrap justify-center gap-2 md:gap-6 bg-white/50 backdrop-blur-lg drop-shadow-2xl rounded-xl p-2 ">
                        {categories.map((cat) => (
                            <TabsTrigger
                                key={cat.id}
                                value={cat.name}
                                className="px-4 py-2  font-medium rounded-xl transition-all
                           hover:bg-primary/10 data-[state=active]:bg-primary data-[state=active]:text-white"
                            >
                                {cat.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* --- Tab Content --- */}
                    {categories.map((cat) => (
                        <TabsContent key={cat.id} value={cat.name} className="mt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cat.courses.length > 0 ? (
                                    cat.courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="group bg-white/90 rounded-2xl drop-shadow-sm hover:drop-shadow-xl 
                                            border border-gray-100 transition-all duration-500 hover:-translate-y-2"
                                        >
                                            {/* Thumbnail Section */}
                                            <div className="relative h-40 bg-linear-to-br from-primary/30 to-primary/5 rounded-t-2xl flex items-center justify-center">
                                                {course?.image ? (
                                                    <img

                                                        src={course?.image as any}
                                                        alt={course?.title || 'Course Image'}
                                                        className="w-full h-full lg:w-full object-cover mx-auto border rounded-t-2xl border-primary shadow-sm"
                                                    />
                                                ) : (
                                                    <span className="text-5xl font-bold text-primary opacity-60 group-hover:scale-110 transition-transform">{(course?.title?.[0] ?? 'C').toUpperCase()}</span>
                                                )}
                                            </div>

                                            {/* Course Info */}
                                            <div className="p-5">
                                                <h4 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-primary transition-colors">{course.title}</h4>
                                                <p className="text-sm text-gray-500 line-clamp-3" dangerouslySetInnerHTML={{ __html: course?.description?.split(' ').slice(0, 25).join(' ') + '...' || '' }}></p>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex justify-between p-4 pt-0">
                                                <div className="text-sm flex items-center gap-1 text-primary hover:text-primary/70 transition-colors">
                                                    <Banknote size={20} /> {Number(course?.price || 0).toFixed(0)}
                                                </div>

                                                <Button variant="default" className="gap-2" onClick={() => handleOpen(course.id)}>
                                                    Enroll Now <ArrowRight size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-gray-500 py-8">No courses available in this category yet.</div>
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                <div className="text-center text-gray-500 py-10">No categories found.</div>
            )}

            <Dialog
                open={!!openItem}
                onOpenChange={(open) => {
                    if (!open) setOpenItem(false);
                }}
            >
                <DialogContent className="max-w-md rounded-2xl bg-white backdrop-blur-sm p-6 shadow-xl">
                    <DialogTitle className="text-lg font-semibold text-gray-800 mb-4">
                        <div className=" flex justify-between mt-2 p-2 bg-primary/5 rounded-2xl">
                            {courseData?.title ? `${courseData.title}` : 'Select a class'}
                            {courseData && courseData?.class_rooms.length > 0 && (
                                <p className="text-gray-800 text-xs line-clamp-2 mt-2 font-semibold ">
                                    {moment(courseData.class_rooms[0].start).format('MMM YY')} - {moment(courseData.class_rooms[0].end).format('MMM YY')}
                                </p>
                            )}
                        </div>
                    </DialogTitle>

                    <div>
                        {courseData && courseData?.class_rooms?.length > 0 && (
                            <>
                                <h3 className="text-sm font-semibold">Choose Your Time</h3>
                                <div className=" grid grid-cols-2 gap-3">
                                    {courseData?.class_rooms.map((data) => (
                                        <div
                                            key={data.id}
                                            onClick={() => handleSelectClass(data.id)}
                                            className={`md:basis-1/2 lg:basis-1/4 relative rounded-2xl min-w-44  mx-2 my-4 p-2 text-center font-semibold text-sm cursor-pointer border transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                                                            ${selectedClass === data.id ? 'bg-primary text-white' : 'border-primary shadow-lg bg-blue-50'}`}
                                        >
                                            {moment(data.start_time, 'HH:mm:ss').format('HH:mm')} - {moment(data.end_time, 'HH:mm:ss').format('HH:mm')}
                                            {selectedClass === data.id && (
                                                <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full ">
                                                    <CheckCircle2 size={14} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button variant="default" disabled={createMutation.isPending} onClick={onSubmit}>
                            {createMutation.isPending ? <Spinner /> : 'Join'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


