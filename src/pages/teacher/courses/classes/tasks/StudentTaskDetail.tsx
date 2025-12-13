import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getStudentLessonRecordDetail } from "@/services/studentLessonTaskService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"

export default function StudentTaskDetail(){
    const params = useParams();
    const lessonId = Number(params.lessonId);
    const enrollId = Number(params.enrollId);

    const {data: records, isLoading} = useQuery({
        queryKey: ['studentRecord', enrollId],
        queryFn:() => getStudentLessonRecordDetail(enrollId, lessonId),
        enabled: !!lessonId && !!enrollId,
    })

      if (isLoading) {
    return (
      <div className="max-w-8xl p-4 mx-auto space-y-6">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur p-6">
          <div className="flex items-center justify-center py-14">
            <Spinner className="text-primary size-7 md:size-8" />
          </div>
        </Card>
      </div>
    );
  }

  
    return (
        <div>
            Hello StudentTask Detail
        </div>
    )
}