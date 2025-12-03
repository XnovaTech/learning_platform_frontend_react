import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ClassRoomType } from '@/types/class';
import { displayTime } from '@/helper/ClassRoom';

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
      <DialogContent className="min-xl md:min-2xl lg:min-w-3xl max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-medium">
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
              <div key={idx} className={`border rounded-lg grid  grid-cols-1 md:grid-cols-2 ${isTeacher ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} lgap-4 p-4 space-y-3 bg-slate-50`}>
                <div>
                  <p className="text-sm text-slate-600 font-semibold">Class</p>
                  <p className="text-base font-medium text-slate-900">
                    {event?.course?.title || '-'} {event.class_name && event.class_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 font-semibold">Time</p>
                  <p className="text-base font-medium text-slate-900">
                    {displayTime(event.start_time)} - {displayTime(event.end_time)}
                  </p>
                </div>
                {!isTeacher && (
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">Teacher </p>
                    <p className="text-base font-medium text-slate-900">Tr. {event?.teacher?.first_name || '-'}</p>
                  </div>
                )}

                <div className="col-span-3">
                  {event.zoom_link && (
                    <Button onClick={() => window.open(event.zoom_link, '_blank')} className="w-full flex items-center justify-center gap-2">
                      <ExternalLink className="size-4" />
                      Join Zoom Meeting
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
