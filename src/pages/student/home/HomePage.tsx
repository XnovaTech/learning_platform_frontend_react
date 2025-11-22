'';

import { useStudentData } from "@/context/StudentDataContext";
import Lottie from "lottie-react";
import Hello from '../../../../public/lottie/Hello.json';
import { Card, CardContent } from "@/components/ui/card";
import { BookAIcon, BookAlert, LayoutDashboard, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
    const { studentData, isLoading, isError } = useStudentData();



    const enrollments = studentData?.enrollments || [];
    const activeEnroll = enrollments.filter(e => Number(e.status) === 1);
    const pendingEnroll = enrollments.filter(e => Number(e.status) === 0);


    if (isLoading)
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-2 text-gray-600">Loading your datas...</span>
            </div>
        );

    if (isError)
        return (
            <div className="text-center text-red-500 font-medium py-10">
                Something went wrong. Please refresh or try again later.
            </div>
        );

    return (
        <>
            <div className="relative mt-7">
                <div className=" bg-linear-to-b from-primary/30 via-primary/20 to-primaary/5 shadow relative backdrop-blur-md rounded-3xl drop-shadow-sm px-6 py-4 flex justify-around items-center  z-10 h-40 overflow-visible">
                    <div>
                        <h1 className="text-3xl">Welcome Back {studentData?.first_name} {studentData?.last_name}</h1>
                        <p className="mt-2 text-xl  font-semibold text-shadow-sm tracking-wider text-primary">Learn with Crystal</p>
                    </div>
                    <div className="relative -top-10 w-60 h-60" >
                        <Lottie animationData={Hello} loop={true} className="h-full w-auto" />
                    </div>

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-6">

                <Link to="/student/enrolls">
                    <Card className="group cursor-pointer bg-linear-to-br form-jade/10 to-jade/40 border-jade/20  hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1">
                        <CardContent className="flex items-center justify-between">
                            <div className="p-4 bg-jade/40 rounded-2xl group-hover:bg-jade/60 transition-colors">
                                <BookAIcon className="h-12 w-12 text-primary" />
                            </div>
                            <div className="text-right">
                                <h2 className="text-4xl font-semibold text-primary">{activeEnroll.length}</h2>
                                <p className="text-lg font-medium text-gray-600">Active Courses</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/student/enrolls">
                    <Card className="group cursor-pointer bg-linear-to-br from-amber-50 to-shell/80 border border-amber-200 hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1">
                        <CardContent className="flex items-center justify-between">
                            <div className="p-4 bg-amber-400/20 rounded-2xl group-hover:bg-amber-400/30 transition-colors">
                                <BookAlert className="h-12 w-12 text-amber-500" />
                            </div>
                            <div className="text-right">
                                <h2 className="text-4xl font-semibold text-amber-500">{pendingEnroll.length}</h2>
                                <p className="text-lg font-medium text-gray-600">Pending Enroll</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                <Card className="group cursor-pointer bg-linear-to-br from-blue-200/50 to-blue-100/50 border-blue-100/20 hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1">
                    <CardContent className="flex items-center justify-between">
                        <div className="p-4 bg-blue-200 rounded-2xl group-hover:bg-blue-400/40 transition-colors">
                            <LayoutDashboard className="h-12 w-12 text-blue-900" />
                        </div>
                        <div className="text-right">
                            <h2 className="text-4xl font-semibold text-blue-900">{pendingEnroll.length}</h2>
                            <p className="text-lg font-medium text-blue-800">Upcoming Lessons</p>
                        </div>
                    </CardContent>

                </Card>

            </div>

        </>

    );
}
