import moment from 'moment';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import Lottie from 'lottie-react';
import Enroll from '../../../../public/lottie/enroll.json';
import { useStudentData } from '@/context/StudentDataContext';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function EnrollPage() {
  const { studentData, isLoading, isError } = useStudentData();

  const enrollments = studentData?.enrollments || [];
  const activeEnroll = enrollments.filter((e) => Number(e?.status) === 1);
  const pendingEnroll = enrollments.filter((e) => Number(e?.status) === 0);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <span className="ml-2 text-gray-600">Loading your courses...</span>
      </div>
    );

  if (isError) return <div className="text-center text-red-500 font-medium py-10">Something went wrong. Please refresh or try again later.</div>;

  const EnrollCard = ({ enrollments }: { enrollments: any[] }) => {
    return (
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments?.map((enroll) => (
          <div key={enroll.id} className="group bg-white/90 rounded-2xl drop-shadow-sm hover:drop-shadow-md cursor-pointer transition-all duration-500 hover:-translate-y-1">
            <div className="relative h-40 bg-linear-to-br from-primary/30 to-primary-5 rounded-t-2xl flex items-center justify-center">
              {enroll?.class_room.course.image ? (
                <img
                  src={enroll.class_room.course.image as any}
                  alt={enroll.class_room.course.title || 'Course Image'}
                  className="w-full h-full object-cover mx-auto shadow-sm border rounded-t-2xl border-primary"
                />
              ) : (
                <span className="text-5xl font-bold text-primary opacity-60 group-hover:scale-110 transition-transform">{(enroll?.class_room.course.title?.[0] ?? 'C').toUpperCase()}</span>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <h3 className="font-semibold tracking-wide">
                  {enroll.class_room.course.category.name} {enroll.class_room.course?.title && `(${enroll.class_room.course?.title})`}
                </h3>

                <Badge variant="secondary" className="text-xs">
                  {enroll.class_room.class_name}
                </Badge>
              </div>
              <div className="text-xs text-gray space-y-2">
                <div className="flex justify-between bg-jade/10 rounded-md px-3 py-1">
                  <p>Duration</p>
                  <p>
                    {moment(enroll.class_room.start).format('MMM YY')} - {moment(enroll.class_room.end).format('MMM YY')}
                  </p>
                </div>
                <div className="flex justify-between bg-jade/10 rounded-md px-3 py-1">
                  <p>Time</p>
                  <p>
                    {moment(enroll.class_room.start_time, 'HH:mm:ss').format('HH:mm')} - {moment(enroll.class_room.end_time, 'HH:mm:ss').format('HH:mm')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end m-2">
              {enroll?.status === 0 ? (
                <Button className="text-xs bg-sunset hover:bg-sunset/80 text-white px-2 py-1 rounded-2xl">Waiting...</Button>
              ) : (
                <Link to={`/student/enrolls/${enroll.id}`}>
                  <Button variant="default" className="gap-2">
                    Enter <ArrowRight size={14} />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-8xl space-y-8 my-4 px-3">
      <div className="flex flex-col lg:flex-row items-start justify-between flex-wrap space-y-5">
        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-semibold text-gray-900 flex items-center">My Enrollments</h2>
          <p className="text-sm text-muted-foreground mt-1">View your pending and active courses </p>
        </div>
      </div>

      {!enrollments || enrollments?.length === 0 ? (
        <div className="text-center  ">
          <Lottie animationData={Enroll} loop className="w-70 h-70 mx-auto mb-4" />
          <p className="font-semibold text-gray-600">You haven’t enrolled in any courses yet.</p>
          <Link to="/student/courses">
            <Button className="mt-4 rounded-md" variant="default">
              Browse Courses
            </Button>
          </Link>
        </div>
      ) : (
        <EnrollCard enrollments={enrollments} />
      )}
    </div>
  );
}
