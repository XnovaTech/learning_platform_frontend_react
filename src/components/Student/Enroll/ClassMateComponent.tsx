import type { ClassMateType } from '../../../types/user';
import { Users, UsersRoundIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { ClassRoomType } from '@/types/class';
import { useMutation } from '@tanstack/react-query';
import { downloadCertificates } from '@/services/classService';

interface ClassMateProps {
  classMates: ClassMateType[] | undefined;
  classRoom?: ClassRoomType | undefined;
  isTeacher?: number;
}

export function ClassMateComponent({ classMates = [], classRoom, isTeacher = 0 }: ClassMateProps) {
  const downloadMutation = useMutation({
    mutationFn: () => downloadCertificates(classRoom?.id!, classRoom?.class_name ?? 'class'),
    onSuccess: () => {
      toast.success('Downloaded Certificates Successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to download student certificates');
    },
  });

  const handleDownload = () => {
    if (!classRoom?.id) {
      toast.error('Class information is missing');
      return;
    }
    downloadMutation.mutate();
  };

  return (
    <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <UsersRoundIcon className="text-sky-800" size={22} />
          Classmates <span className="text-sm">({classMates.length})</span>
        </h2>

        {isTeacher && classRoom?.is_finish == 1 && classMates.length > 0 && (
          <Button variant="red" size="sm" onClick={handleDownload} disabled={downloadMutation.isPending} className="rounded-lg w-[200px]  flex items-center  gap-2">
            <Download className="size-4" />
            {downloadMutation.isPending ? 'Downloading...' : 'Download Certificates'}
          </Button>
        )}
      </div>

      <ul className="grid grid-cols-1 gap-5">
        {classMates.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full bg-primary/90 p-4 mb-4">
              <Users className="size-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-1">No Class Mates Found</h4>
          </div>
        ) : (
          classMates.map((mate) => (
            <li key={mate.id} className="group flex items-center gap-4 bg-sky-200/40 border border-gray-100 rounded-2xl shadow-sm p-4 hover:shadow-md transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-sky-200 flex items-center justify-center text-sky-800 font-semibold text-lg">{mate.first_name?.[0]?.toUpperCase() || 'U'}</div>
              <div>
                <p className="text-gray-800 font-semibold group-hover:text-sky-800 transition-colors">
                  {mate.first_name} {mate.last_name}
                </p>
                <p className="text-gray-600 text-sm">{mate.email}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
