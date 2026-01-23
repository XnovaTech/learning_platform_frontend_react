import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortableSectionItem({
  id,
  disabled,
  children,
}: {
  id: number;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id,
      disabled,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-3 top-1/2 -translate-y-1/2 cursor-grab text-muted-foreground"
        >
          <GripVertical size={16} />
        </div>
      )}

      <div className={disabled ? '' : 'pl-8'}>{children}</div>
    </div>
  );
}
