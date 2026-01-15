import type { ClassMateType } from '../../../types/user';
import { Users, UsersRoundIcon } from 'lucide-react';

interface ClassMateProps {
  classMates: ClassMateType[] | undefined;
}

export function ClassMateComponent({ classMates = [] }: ClassMateProps) {
  return (
    <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <UsersRoundIcon size={22} />
          Classmates <span className="text-sm">({classMates.length})</span>
        </h2>

        {/* {isTeacher == 1 && classRoom?.is_finish == 1 && classMates.length > 0 && (
          <Button variant="red" size="sm" onClick={handleDownload} disabled={downloadMutation.isPending} className="rounded-lg w-[200px]  flex items-center  gap-2">
            <Download className="size-4" />
            {downloadMutation.isPending ? 'Downloading...' : 'Download Certificates'}
          </Button>
        )} */}
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
            <li
              key={mate.id}
              className="group flex items-center gap-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl shadow-lg p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-fade-in"
            >
              <div className="relative">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  {mate.first_name?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                  {mate.first_name} {mate.last_name}
                </p>
                <p className="text-gray-600 text-sm flex items-center gap-2">{mate.email}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
