import React, { useState, useEffect, } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { getCourseWithClass } from "@/services/courseService";
import { useAuth } from "@/context/AuthContext";
import Teacher from '../../../public/lottie/Teacher.json';
import Lottie from "lottie-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import { CheckCircle2, Loader2 } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import moment from 'moment';
import { createEnroll } from "@/services/enrollService";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";


const EnrollPage = () => {
    const navigate = useNavigate();
    const [isForm, setIsForm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const { user } = useAuth();
    const studentId = user?.id;


    const queryClient = useQueryClient();
    const createMutation = useMutation({
        mutationFn: createEnroll,
        onSuccess: async () => {
            toast.success('We will contact you soon.');
            await queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            navigate('/student');
        },
        onError: (e) => {
            toast.error(e?.message || 'Failed to Enroll');
        }
    })

    const onSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        await createMutation.mutateAsync({
            student_id: user?.id,
            class_id: selectedClass,
        });
    }

    const { data: courses = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['courses'],
        queryFn: getCourseWithClass,
        enabled: !!studentId,
    });



    const getSelectedCourse = () => {
        return courses?.find(course => course.id == selectedCourse
        );
    }

    const selectCourseData = getSelectedCourse() || {class_rooms: []};


    const handleSelect = (courseId: number) => {
        setSelectedCourse(courseId);
    }

    const handleSelectClass = (classId: number) => {
        setSelectedClass(classId);
    }

    useEffect(() => {
        if (studentId) {
            refetch();
        }
    }, [studentId, refetch])

    if (isLoading)
        return (
            <div className='flex justify-center items-center h-80'>
                <Loader2 className='w-6 h-6 text-primary animate-spin' />
                <span className='ml-2 text-gray-600'>Loading Courses ...</span>
            </div>
        );

    if (isError)
        return (
            <div className="text-center text-red-500 font-medium py-10">
                Failed to load courses. Please try again later.
            </div>
        )
    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <div className="bg-primary/60 backdrop-blur-md flex flex-col max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl p-8 md:p-12 mx-3 md:mx-0 transition-all">
                {
                    !isForm ? (
                        <div>
                            <div className="flex flex-col md:flex-row item-center justify-center space-y-2 md:space-y-0">
                                <div className=" flex flex-col space-y-3 md:justify-center md:items-start items-center">
                                    <h1 className=" text-4xl font-bold text-white">
                                        Hey {user?.first_name} {user?.last_name}
                                    </h1>
                                    <p className=" text-lg md:text-4xl md:font-bold text-gray-700 font-medium">
                                        Let&apos;s Join to Class, Frist
                                    </p>
                                </div>

                                <Lottie
                                    animationData={Teacher}
                                    loop={true}
                                    className=" drop-shadow-xl w-60 md:w-80 md:mx-0 mx-auto" />
                            </div>

                            <div className=" flex justify-between space-x-6 mt-10">
                                <Link to="/student">
                                    <Button variant="link_white">Skip for Now</Button>
                                </Link>
                                <Button variant="white" onClick={() => setIsForm(true)}>Next</Button>

                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="p-2">
                                <h2 className=" text-secondary font-bold text-2xl drop-shadow-sm mb-8 text-center">
                                    Select Your Class
                                </h2>
                                {
                                    isLoading && (
                                        <p className="text-center text-gray-500">Loading courses ...</p>
                                    )
                                }
                                {
                                    isError && (
                                        <p className=" text-center text-red-500">
                                            Failed to load courses.
                                        </p>
                                    )
                                }

                                <Carousel className="w-full">
                                    <CarouselContent className="-m-2 md:-ml-2">
                                        {courses.map((course) => (
                                            <CarouselItem
                                                key={course.id}
                                                onClick={() => handleSelect(course.id)}
                                                className={`md:basis-1/2 lg:basis-1/3 relative rounded-2xl  mx-2 my-4 cursor-pointer border transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                                                            ${selectedCourse === course.id
                                                        ? "border-primary shadow-lg bg-blue-50"
                                                        : "border-cyan-100 bg-cyan-50"
                                                    }`}
                                            >
                                                <div className="p-4 text-center">
                                                    <h2
                                                        className={`font-semibold ${selectedCourse === course.id
                                                            ? "text-blue-700"
                                                            : "text-gray-800"
                                                            }`}
                                                    >
                                                        {course.category.name} -  {course.title}
                                                    </h2>

                                                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                                        {course.description ||
                                                            "Learn and grow with this course."}
                                                    </p>
                                                    {
                                                        course.class_rooms.length > 0 && <p className="text-gray-600 text-xs mt-2 line-clamp-2 font-semibold p-2 bg-primary/5 rounded-2xl">
                                                            {moment(course.class_rooms[0].start).format("MMM YY")} - {moment(course.class_rooms[0].end).format("MMM YY")}
                                                        </p>
                                                    }

                                                </div>

                                                {selectedCourse === course.id && (
                                                    <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full ">
                                                        <CheckCircle2 size={14} />
                                                    </div>
                                                )}
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious variant="white" />
                                    <CarouselNext variant="white" />
                                </Carousel>

                                {
                                    selectCourseData && selectCourseData?.class_rooms.length > 0 &&
                                    <div className=" bg-white/60 p-3 rounded-2xl ">
                                        <p className="text-sm font-semibold text-slate-700">Choose Your Time</p>
                                        <Carousel className="w-full">
                                            <CarouselContent className="-m-2 md:-ml-2">
                                                {selectCourseData?.class_rooms.map((data) => (
                                                    <CarouselItem
                                                        key={data.id}
                                                        onClick={() => handleSelectClass(data.id)}
                                                        className={`md:basis-1/2 lg:basis-1/4 relative rounded-2xl  mx-2 my-4 p-2 text-center font-semibold text-sm cursor-pointer border transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                                                            ${selectedClass === data.id
                                                                ? "border-primary shadow-lg bg-blue-50"
                                                                : "border-cyan-100 bg-cyan-50"
                                                            }`}
                                                    >

                                                        {moment(data.start_time, "HH:mm:ss").format("HH:mm")} - {moment(data.end_time, "HH:mm:ss").format("HH:mm")}
                                                        {selectedClass === data.id && (
                                                            <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full ">
                                                                <CheckCircle2 size={14} />
                                                            </div>
                                                        )}
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>

                                        </Carousel>
                                    </div>
                                }



                            </div>

                            <div className=" flex justify-between space-x-6 mt-10">

                                <Button variant="link_white" onClick={() => setIsForm(false)}>Back</Button>

                                <Button variant="white"
                                    disabled={createMutation.isPending}
                                    onClick={onSubmit}>
                                    {createMutation.isPending ? <Spinner /> : 'Join'}
                                </Button>
                            </div>

                        </div>
                    )
                }



            </div>
        </div >

    )
}

export default EnrollPage;