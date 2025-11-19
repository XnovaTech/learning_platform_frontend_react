;

import React, { useRef } from 'react';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import Enroll from './../../../public/lottie/enroll.json';
import { useStudentData } from '@/context/StudentDataContext';
import Image from 'next/image';

export default function Page() {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const { studentData, isLoading, isError } = useStudentData();

    const enrollments = studentData?.enrollments || [];
    const activeEnroll = enrollments.filter(e => e.status === 1);
    const pendingEnroll = enrollments.filter(e => e.status === 0);

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-2 text-gray-600">Loading your courses...</span>
            </div>
        );

    if (isError)
        return (
            <div className="text-center text-red-500 font-medium py-10">
                Something went wrong. Please refresh or try again later.
            </div>
        );

    if (enrollments.length === 0)
        return (
            <div className="text-center py-10 text-gray-500">
                <Lottie
                    lottieRef={lottieRef}
                    animationData={Enroll}
                    loop
                    className=" w-60 h-60 mx-auto mb-4"
                />
                <p className=' font-semibold text-gray-600'>You haven’t enrolled in any courses yet.</p>
                <Link href="/student/courses">
                    <Button className="mt-8 text-primary bg-white/50 rounded-2xl"
                        variant="primary">Browse Courses</Button>
                </Link>
            </div>
        );

    return (
        <div className="space-y-4 ">
            <div className='pb-2 border-b border-gray-100'>
                <h2 className='text-2xl font-semibold text-gray-900 flex items-center'>
                    <BookOpen className='w-7 h-7 text-primary mr-4' />
                    My Courses
                </h2>
            </div>


            {pendingEnroll.length > 0 &&
                <div className='bg-white/30 p-3 rounded-2xl'>

                    <h3 className=' text-gray-800 font-semibold text-lg mb-4'>Pending Courses</h3>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            pendingEnroll.map((enroll) => (
                                <div key={enroll.id}
                                    className='group bg-white/90 rounded-2xl drop-shadow-sm hover:drop-shadow-md cursor-pointer
                                     transition-all duration-500 hover:-translate-y-1'>
                                    {/* Thumbnail Section*/}
                                    <div className=' relative h-40 bg-gradient-to-br from-primary/30 to-primary-5 rounded-t-2xl flex items-center justify-center'>
                                        {
                                            enroll?.class_room.course.image ? (
                                                <Image
                                                    fill
                                                    src={enroll?.class_room.course.image as any}
                                                    alt={enroll?.class_room.course.title || 'Course Image'}
                                                    className="w-full h-full lg:w-full shadow-sm object-cover mx-auto border rounded-t-2xl border-primary" />
                                            ) : (

                                                <span className="text-5xl font-bold text-primary opacity-60 group-hover:scale-110 transition-transform" >{(enroll?.class_room.course.title?.[0] ?? 'C').toUpperCase()}</span>

                                            )
                                        }
                                    </div>
                                    <div className=' p-4 space-y-2'>
                                        <div className=' flex justify-between'>
                                            <h3 className='font-semibold tracking-wide'>{enroll.class_room.course.category.name} ({enroll.class_room.course.title})</h3>
                                            <p className=' text-xs font-medium text-primary bg-shell/50 px-2 py-0.5 rounded-full'>
                                                {enroll.class_room.class_name}
                                            </p>

                                        </div>



                                        <div className=' text-xs text-gray space-y-1'>
                                            <div className='flex justify-between bg-jade/10 rounded-md px-3 py-1'>
                                                <p>Duration</p>
                                                <p> {moment(enroll.class_room.start).format("MMM YY")} - {moment(enroll.class_room.end).format("MMM YY")} </p>
                                            </div>

                                            <div className=' flex justify-between bg-jade/10 rounded-md px-3 py-1'>
                                                <p>Time</p>
                                                <p> {moment(enroll.class_room.start_time, "HH:mm:ss").format("HH:mm")} - {moment(enroll.class_room.end_time, "HH:mm:ss").format("HH:mm")} </p>
                                            </div>
                                        </div>


                                    </div>
                                    <div className=' flex justify-end m-2'>
                                        <p className='text-xs bg-sunset text-white px-2 py-1 rounded-2xl'>Waiting...</p>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                </div>

            }

            {
                activeEnroll.length > 0 &&
                <div className='bg-white/30 p-3 rounded-2xl'>

                    <h3 className=' text-gray-800 font-semibold text-lg mb-4'>Active Courses</h3>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            activeEnroll.map((enroll) => (
                                <div key={enroll.id}
                                    className='group bg-white/90 rounded-2xl drop-shadow-sm hover:drop-shadow-md cursor-pointer
                                     transition-all duration-500 hover:-translate-y-1'>
                                    {/* Thumbnail Section*/}
                                    <div className=' relative h-40 bg-gradient-to-br from-primary/30 to-primary-5 rounded-t-2xl flex items-center justify-center'>
                                        {
                                            enroll?.class_room.course.image ? (
                                                <Image
                                                    src={enroll?.class_room.course.image as any}
                                                    alt={enroll?.class_room.course.title || 'Course Image'}
                                                    className="w-full h-full lg:w-full object-cover mx-auto shadow-sm border rounded-t-2xl border-primary" />
                                            ) : (

                                                <span className="text-5xl font-bold text-primary opacity-60 group-hover:scale-110 transition-transform" >{(enroll?.class_room.course.title?.[0] ?? 'C').toUpperCase()}</span>

                                            )
                                        }
                                    </div>
                                    <div className=' p-4 space-y-2'>
                                        <div className=' flex justify-between'>
                                            <h3 className='font-semibold tracking-wide'>{enroll.class_room.course.category.name} ({enroll.class_room.course.title})</h3>
                                            <p className=' text-xs font-medium text-primary bg-shell/50 px-2 py-0.5 rounded-full'>
                                                {enroll.class_room.class_name}
                                            </p>

                                        </div>


                                        <div className=' text-xs text-gray space-y-1'>
                                            <div className='flex justify-between bg-jade/10 rounded-md px-3 py-1'>
                                                <p>Duration</p>
                                                <p> {moment(enroll.class_room.start).format("MMM YY")} - {moment(enroll.class_room.end).format("MMM YY")} </p>
                                            </div>

                                            <div className=' flex justify-between bg-jade/10 rounded-md px-3 py-1'>
                                                <p>Time</p>
                                                <p> {moment(enroll.class_room.start_time, "HH:mm:ss").format("HH:mm")} - {moment(enroll.class_room.end_time, "HH:mm:ss").format("HH:mm")} </p>
                                            </div>
                                        </div>


                                    </div>
                                    <div className=' flex justify-end m-2'>
                                        <Link
                                            href={`/student/enrolls/${enroll.id}`}
                                            prefetch>
                                            <Button variant="default"
                                                className=' gap-2'>
                                                Enter <ArrowRight size={14} />
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                </div>

            }

        </div >
    );
}
