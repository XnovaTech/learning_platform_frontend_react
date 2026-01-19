import { useEffect, useRef, useState } from 'react';
import type { LessonTaskType, CourseExamType } from '@/types/task';

interface MatchingTaskComponentProps {
  task: LessonTaskType | CourseExamType;
  onAnswer: (taskId: number, value: any) => void;
  value?: Record<string, string>;
  readonly?: boolean;
}

export default function MatchingTaskComponent({ task, onAnswer, value = {}, readonly = false }: MatchingTaskComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>(value);

  const [positions, setPositions] = useState<{ left: any; right: any }>({
    left: {},
    right: {},
  });

  // Calculate positions relative to container
  const updatePositions = () => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const leftEls = containerRef.current.querySelectorAll('.left-item');
    const rightEls = containerRef.current.querySelectorAll('.right-item');

    const leftPos: any = {};
    const rightPos: any = {};

    leftEls.forEach((el: any) => {
      const id = el.getAttribute('data-id');
      const rect = el.getBoundingClientRect();
      leftPos[id] = {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
      };
    });

    rightEls.forEach((el: any) => {
      const id = el.getAttribute('data-id');
      const rect = el.getBoundingClientRect();
      rightPos[id] = {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
      };
    });

    setPositions({ left: leftPos, right: rightPos });
  };

  useEffect(() => {
    updatePositions();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions, true);

    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions, true);
    };
  }, [task, pairs]);

  useEffect(() => {
    if (value && Object.keys(value).length > 0) {
      setPairs(value);
    }
  }, [value]);

  const handleLeftClick = (id: string) => {
    if (readonly) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (readonly || !selectedLeft) return;

    const updated = { ...pairs, [selectedLeft]: id };
    setPairs(updated);
    onAnswer(task.id, updated);
    setSelectedLeft(null);
  };

  return (
    <div ref={containerRef} className="relative p-4 bg-stone-50 rounded-lg shadow">
      {/* SVG Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {Object.entries(pairs).map(([leftId, rightId]) => {
          const left = positions.left[leftId];
          const right = positions.right[rightId];
          if (!left || !right) return null;

          return <line key={leftId} x1={left.x + left.width} y1={left.y + left.height / 2} x2={right.x} y2={right.y + right.height / 2} stroke="green" strokeWidth={2} strokeLinecap="round" />;
        })}
      </svg>

      <div className=" flex justify-around gap-8">
        {/* LEFT */}
        <div className="space-y-4">
          {task.left?.map((item) => {
            const isSelected = selectedLeft === item.id.toString();

            return (
              <div
                key={item.id}
                data-id={item.id}
                className={`
            left-item p-3 border rounded-lg transition
            ${isSelected ? 'bg-primary/10 border-primary  text-primary' : 'bg-white'}
            ${readonly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
          `}
                onClick={() => handleLeftClick(item.id.toString())}
              >
                {item.text}
              </div>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          {task.right?.map((item) => (
            <div
              key={item.id}
              data-id={item.id}
              className={`right-item p-3 border rounded-lg transition ${readonly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-gray-100'}`}
              onClick={() => handleRightClick(item.id.toString())}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
