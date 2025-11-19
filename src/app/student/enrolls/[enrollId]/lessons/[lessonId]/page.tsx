'';

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { lessonDetail } from "@/services/lessonService";
import { LessonType } from "@/types/lesson";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import ReactPlayer from 'react-player'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useParams } from "next/navigation";


export default function StudentEnrollLessonPage() {
    // const { enrollId, lessonId } = use(params);
    const params = useParams();
    const lessonID = Number(params.lessonId);
    const enrollID = Number(params.enrollId);



    const { data: lesson, isLoading } = useQuery<LessonType>({
        queryKey: ['lesson', lessonID],
        queryFn: () => lessonDetail(lessonID),
        enabled: !Number.isNaN(lessonID),
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    if (isLoading) {
        return (
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur p-8 flex items-center justify-center h-[60vh]">
                <Spinner className="text-primary size-8" />
            </Card>
        );
    }

    return (

        <div className=" max-w-6xl mx-auto px-4 py-5 space-y-10">
            {/* Breadcrumbs */}
            <Breadcrumb>
                <BreadcrumbList>
                    {/* <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link className="text-base md:text-xs" href="/student/enrolls">
                                My Courses
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator /> */}
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link className="text-base md:text-xs" href={`/student/enrolls/${enrollID}`}>
                                ClassRoom
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-base md:text-xs">{lesson?.title ?? 'Detail'}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="bg-white/50 backdrop-blur-lg shadow-xl rounded-2xl p-8 transition-all">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    {lesson?.title}
                </h2>
                <div className="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    <div dangerouslySetInnerHTML={{ __html: lesson?.description || "<p>No content available.</p>" }} />
                </div>
            </div>

            <div className=" drop-shadow-2xl backdrop-blur-lg bg-white/50 dark:bg-slate-900/80 rounded-2xl p-6 md:p-8">
                <h2 className=" text-xl font-semibold text-slate-800 mb-6">Lesson Video</h2>
                {lesson?.youtube_link ? (
                    <div className=" aspect-video rounded-xl overflow-hidden drop-shadow-md border border-gray-200 dark:border-gray-700">
                        <ReactPlayer
                            src={lesson.youtube_link}
                            className="react-player"
                            width="100%" height="100%"
                            controls
                            style={{ borderRadius: '1rem' }}
                            config={{
                                youtube: {
                                    playerVars: {
                                        rel: 0,
                                        showinfo: 0,
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

            {/* <Tabs
                defaultValue="youtube"
                className="w-full max-w-7xl mx-auto my-6">
                <TabsList className="flex flex-wrap justify-center gap-2 md:gap-6  bg-white/50 backdrop-blur-lg drop-shadow-2xl rounded-xl p-2 h-12.5">
                    <TabsTrigger
                        value="youtube"
                        className="px-4 py-2  font-medium rounded-xl transition-all
                                                       hover:bg-primary-100 data-[state=active]:bg-ocean data-[state=active]:text-white"
                    >
                        Lesson Video
                    </TabsTrigger>

                    <TabsTrigger
                        value="zoom"
                        className="px-4 py-2  font-medium rounded-xl transition-all
                                                       hover:bg-primary-100 data-[state=active]:bg-sky-600 data-[state=active]:text-white"
                    >
                        Live Class (Zoom)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="youtube" className="w-full mt-6">
                    <div className=" drop-shadow-2xl backdrop-blur-lg bg-white/50 dark:bg-slate-900/80 rounded-2xl p-6 md:p-8">
                        {lesson?.youtube_link ? (
                            <div className=" aspect-video rounded-xl overflow-hidden drop-shadow-md border border-gray-200 dark:border-gray-700">
                                <ReactPlayer
                                    src={lesson.youtube_link}
                                    className="react-player"
                                    width="100%" height="100%"
                                    controls
                                    style={{ borderRadius: '1rem' }}
                                    config={{
                                        youtube: {
                                            playerVars: {
                                                rel: 0,
                                                showinfo: 0,
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
                <TabsContent value="zoom" className="mt-3 w-full">
                    <div className=" drop-shadow-2xl backdrop-blur-lg bg-white/50 dark:bg-slate-900/80 rounded-2xl p-6 md:p-8 text-center">
                        {lesson?.zoom_link ? (
                            <>
                                <div className="flex mb-4 justify-center">
                                    <Lottie lottieRef={lottieRef} animationData={Hello} loop={true} className=" w-52" />
                                </div>

                                <h3 className="text-2xm font-semibold text-gray-800 mb-3">
                                    Join the Live Class !
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Click below to enter the Zoom meeting room.
                                </p>
                                <a
                                    href={lesson.zoom_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-8 py-4 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors"
                                >
                                    Join Zoom Class
                                </a>
                            </>
                        ) : (
                            <p className="text-center text-gray-600 dark:text-gray-300 py-10 text-lg">No Zoom link available for this lesson.</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs> */}



        </div>
    )

}
