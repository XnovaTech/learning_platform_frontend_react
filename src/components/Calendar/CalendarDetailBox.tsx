import { Clock, ExternalLink, School, User2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ClassRoomType } from '@/types/class';
import { displayTime } from '@/utils/format';
import { Link } from 'react-router-dom';

interface ClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  isTeacher?: boolean;
  events: ClassRoomType[];
}

export default function CalendarDetailBox({ isOpen, onClose, date, events, isTeacher = false }: ClassDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="  min-w-xs md:min-w-2xl lg:min-w-3xl max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-medium text-left">
            {date?.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No classes scheduled for this day</p>
          ) : (
            events.map((event, idx) => (
              <div key={idx} className={`border rounded-lg grid gap-3  grid-cols-1 md:grid-cols-2   p-3   bg-slate-50`}>
                <div className={`flex col-span-1 ${isTeacher && 'md:col-span-2'}    items-center gap-3 p-2 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100`}>
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <School className="size-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">Course - Class</div>
                    <div className="text-sm font-semibold text-blue-900">{event?.course?.title || '-'}</div>
                  </div>
                </div>

                <div className="flex col-span-1 items-center gap-3 p-2 rounded-xl bg-linear-to-r from-purple-50 to-pink-50 border border-purple-100">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Clock className="size-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-purple-700 uppercase tracking-wide mb-1">Time</div>
                    <div className="text-sm font-semibold text-purple-900">
                      {displayTime(event?.start_time)} - {displayTime(event?.end_time)}
                    </div>
                  </div>
                </div>

                {!isTeacher && (
                  <div className="flex items-center col-span-1 gap-3 p-2 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 border border-green-100">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <User2 className="size-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">Teacher</div>
                      <div className="text-sm font-semibold text-green-900">{event?.teacher?.first_name || ''} </div>
                    </div>
                  </div>
                )}

                {event.zoom_link && (
                  <Link to={event.zoom_link} target="_blank" className="flex items-center gap-3 p-2  cursor-pointer rounded-xl bg-linear-to-r from-orange-50 to-red-50 border border-orange-100">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <ExternalLink className="size-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-orange-700 uppercase tracking-wide mb-1">Zoom Class</div>
                      <div className="text-sm font-semibold text-orange-900">Join Zoom</div>
                    </div>
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
