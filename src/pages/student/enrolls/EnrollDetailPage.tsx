import { useQuery } from "@tanstack/react-query";
import { enrollDetail } from "@/services/enrollService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { EnrollType } from "@/types/enroll";
import { User2 } from "lucide-react";
import { LessonsComponent } from "@/components/Student/Enroll/LessonsComponent";
import { ClassMateComponent } from "@/components/Student/Enroll/ClassMateComponent";
import { DiscussionComponent } from "@/components/Student/Enroll/DiscussionComponent";
import { ZoomRoomComponent } from "@/components/Student/Enroll/ZoomRoomComponent";
import { useStudentData } from "@/context/StudentDataContext";
import { useParams } from "react-router-dom";

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
        refetchOnMount: false
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
                    <div className=" bg-white/50 backdrop-blur-lg drop-shadow-2xl p-5 overflow-hidden  rounded-2xl">
                        <div className=" flex flex-col lg:flex-row items-center gap-4">
                            <div className="w-full h-52 px-2 lg:w-70 lg:h-auto">
                                {
                                    enroll?.class_room?.course?.image ? (
                                        <img
                                            src={enroll?.class_room?.course?.image as any}
                                            alt={enroll?.class_room?.course?.title || 'Course Image'}
                                            className="w-full h-full lg:w-52= lg:h-52 object-cover shadow-md mx-auto border rounded-xl  border-primary" />
                                    ) : (
                                        <div className="w-full h-full lg:w-48 lg:h-48 flex items-center justify-center mx-auto rounded-xl border-primary bg-primary/10 text-primary">
                                            <span className="text-5xl font-bold">{(enroll?.class_room?.course?.title?.[0] ?? 'C').toUpperCase()}</span>
                                        </div>
                                    )
                                }
                            </div>

                            <div className="w-full space-y-4">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap space-y-2 items-center justify-between ">
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">{enroll?.class_room?.course?.title}</h2>
                                        {enroll?.class_room?.course?.category?.name && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs">{enroll?.class_room?.course?.category.name}</span>}
                                    </div>

                                    <p className="text-muted-foreground  text-sm" dangerouslySetInnerHTML={{ __html: enroll?.class_room?.course?.description || 'No description available' }}></p>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-3 ">
                                    <div className="bg-primary/80 flex flex-row px-3 py-1.5 text-sm rounded-full shadow gap-3">
                                        <User2 className=" w-7 h-7 p-2 bg-white/70 rounded-full" />
                                        <p className=" font-semibold text-white mt-1">Tr.{enroll?.class_room?.teacher?.first_name}</p>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>

                    <Tabs
                        defaultValue="lessons"
                        className="w-full max-w-7xl mx-auto my-6">
                        {/* Tab List */}
                        <TabsList className="flex flex-wrap justify-center gap-2 md:gap-6  bg-white/50 backdrop-blur-lg drop-shadow-2xl rounded-xl p-2 h-12.5">
                            <TabsTrigger

                                value="lessons"
                                className="px-4 py-2  font-medium rounded-xl transition-all
                                                       hover:bg-primary/10 data-[state=active]:bg-ocean data-[state=active]:text-white"
                            >
                                Lessons
                            </TabsTrigger>

                            <TabsTrigger

                                value="classmates"
                                className="px-4 py-2  font-medium rounded-xl transition-all
                                                       hover:bg-primary/10 data-[state=active]:bg-sky-600 data-[state=active]:text-white"
                            >
                                Classmates
                            </TabsTrigger>

                            <TabsTrigger

                                value="discussion"
                                className="px-4 py-2  font-medium rounded-xl transition-all
                                                       hover:bg-primary/10 data-[state=active]:bg-sunset data-[state=active]:text-white"
                            >
                                Discuss Room
                            </TabsTrigger>
                            <TabsTrigger
                                value="zoom"
                                className="px-4 py-2  font-medium rounded-xl transition-all
                                                       hover:bg-primary-100 data-[state=active]:bg-sky-600 data-[state=active]:text-white"
                            >
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
                            {studentId && (
                                <DiscussionComponent
                                    classId={enroll?.class_room?.id as number}
                                    userId={studentId}
                                />
                            )}
                        </TabsContent>
                        <TabsContent value="zoom" className="mt-3 w-full">
                            <ZoomRoomComponent zoomLink={enroll?.class_room?.zoom_link} />
                        </TabsContent>
                    </Tabs>
                </>

            )}
        </>
    )
}