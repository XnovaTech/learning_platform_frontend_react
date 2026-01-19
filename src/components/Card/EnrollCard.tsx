import type { EnrollType } from '@/types/enroll';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

interface CardProps {
  enrolls?: EnrollType[];
  isActive?: number;
}

export default function EnrollCard({ enrolls, isActive }: CardProps) {
  return (
    <>
      {enrolls?.map((enroll) => (
        <div
          key={enroll.id}
          className="group bg-white/90 rounded-2xl drop-shadow-sm hover:drop-shadow-md cursor-pointer
                                                    transition-all duration-500 hover:-translate-y-1"
        >
          {/* Thumbnail Section*/}
          <div className=" relative h-40 bg-linear-to-br from-primary/30 to-primary-5 rounded-t-2xl flex items-center justify-center">
            {enroll?.class_room.course.image ? (
              <img
                src={enroll?.class_room.course.image as any}
                alt={enroll?.class_room.course.title || 'Course Image'}
                className="w-full h-full lg:w-full shadow-sm object-cover mx-auto border rounded-t-2xl border-primary"
              />
            ) : (
              <span className="text-5xl font-bold text-primary opacity-60 group-hover:scale-110 transition-transform">{(enroll?.class_room.course.title?.[0] ?? 'C').toUpperCase()}</span>
            )}
          </div>
          <div className=" p-4 space-y-2">
            <div className=" flex flex-wrap gap-3 justify-between">
              <h3 className="font-semibold tracking-wide">
                {enroll.class_room.course.category.name} ({enroll.class_room.course.title})
              </h3>
              <p className=" text-xs font-medium text-primary bg-shell/50 px-2 py-0.5 rounded-full">{enroll.class_room.class_name}</p>
            </div>

            <div className=" text-xs text-gray space-y-1">
              <div className="flex justify-between bg-jade/10 rounded-md px-3 py-1">
                <p>Duration</p>
                <p>
                  {' '}
                  {moment(enroll.class_room.start).format('MMM YY')} - {moment(enroll.class_room.end).format('MMM YY')}{' '}
                </p>
              </div>

              <div className=" flex justify-between bg-jade/10 rounded-md px-3 py-1">
                <p>Time</p>
                <p>
                  {' '}
                  {moment(enroll.class_room.start_time, 'HH:mm:ss').format('HH:mm')} - {moment(enroll.class_room.end_time, 'HH:mm:ss').format('HH:mm')}{' '}
                </p>
              </div>
            </div>
          </div>
          <div className=" flex justify-end m-2">
            {isActive === 1 ? (
              <Link to={`/student/enrolls/${enroll.id}`}>
                <Button variant="default" className=" gap-2">
                  Enter <ArrowRight size={14} />
                </Button>
              </Link>
            ) : (
              <p className="text-xs bg-sunset text-white px-2 py-1 rounded-2xl">Waiting...</p>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
