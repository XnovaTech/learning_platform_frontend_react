import { useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DocumentItem from '@/components/Files/DocumentItem';
import type { LessonType } from '@/types/lesson';

interface LessonTypeProps {
  lesson: LessonType | undefined;
}

export default function LessonCard({ lesson }: LessonTypeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-0 shadow-xl bg-white/80 p-4 backdrop-blur overflow-hidden">
      <CardTitle className="text-3xl font-semibold">{lesson?.title}</CardTitle>

      {lesson?.description && (
        <>
          <div
            className={`text-muted-foreground min-h-24 text-base leading-relaxed transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[2000px]' : 'max-h-24'}`}
            dangerouslySetInnerHTML={{ __html: lesson?.description || '' }}
          />
          <Button
            variant="link"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-primary flex justify-end text-sm transition-all  p-0 font-medium hover:underline underline-offset-1 mt-1"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </Button>
        </>
      )}

      <div className="space-y-3   ">{lesson?.documents && lesson.documents.length > 0 && lesson.documents.map((doc) => <DocumentItem key={doc.id} doc={doc} />)}</div>
    </Card>
  );
}
