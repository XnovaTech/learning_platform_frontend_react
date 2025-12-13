import { Button } from '@/components/ui/button';
import { BookOpen, Loader2 } from 'lucide-react';
import Lottie from 'lottie-react';
import Enroll from '../../../../public/lottie/enroll.json';
import { useStudentData } from '@/context/StudentDataContext';
import { Link } from 'react-router-dom';
import EnrollCard from '@/components/Card/EnrollCard';


export default function EnrollPage() {
    const { studentData, isLoading, isError } = useStudentData();

    const enrollments = studentData?.enrollments || [];
    const activeEnroll = enrollments.filter(e => Number(e?.status) === 1);
    const pendingEnroll = enrollments.filter(e => Number(e?.status) === 0);

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
                    animationData={Enroll}
                    loop
                    className=" w-60 h-60 mx-auto mb-4"
                />
                <p className=' font-semibold text-gray-600'>You haven’t enrolled in any courses yet.</p>
                <Link to="/student/courses">
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
                        <EnrollCard enrolls={pendingEnroll} isActive={0}/>
                    </div>
                </div>

            }

            {
                activeEnroll.length > 0 &&
                <div className='bg-white/30 p-3 rounded-2xl'>

                    <h3 className=' text-gray-800 font-semibold text-lg mb-4'>Active Courses</h3>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        <EnrollCard enrolls={activeEnroll} isActive={1}/>
                    </div>
                </div>

            }

        </div >
    );
}