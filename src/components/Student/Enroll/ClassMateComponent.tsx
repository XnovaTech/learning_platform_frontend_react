import type { ClassMateType } from '../../../types/user';
import { Users, UsersRoundIcon } from 'lucide-react';

interface ClassMateProps {
  classMates: ClassMateType[] | undefined;
}

export function ClassMateComponent({ classMates = [] }: ClassMateProps) {
  return (
    <div className=" bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-xl space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <UsersRoundIcon className="text-sky-800" size={22} />
        Classmates <span className="text-sm">({classMates.length})</span>
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-5">
        {classMates.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full bg-primary/90 p-4 mb-4">
              <Users className="size-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-1">No Class Mates Found</h4>
          </div>
        ) : (
          classMates?.map((mate) => (
            <li key={mate.id} className="group flex items-center gap-4 bg-sky-200/40 border border-gray-100 rounded-2xl shadow-sm p-4 hover:shadow-lg transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-sky-200 flex items-center justify-center text-sky-800 font-semibold text-lg">{mate.first_name?.[0].toUpperCase() || 'U'}</div>
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
