import React, {useEffect, useState} from 'react';
import { DragDropBuilder, FillBlankBuilder, MatchingBuilder, ShortAnswerBuilder, LongAnswerBuilder, McqBuilder, TrueFalseBuilder, ParagraphDragDropBuilder } from '@/components/builders';
import type { TaskType, DragDropExtraData, MatchingExtraData, CreateCourseExamPayloadType, ParagraphDropdownData } from '@/types/task';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourseExam, uploadImage } from '@/services/courseExamService';
import { toast } from 'sonner';
import { LessonTaskQuill } from '@/components/ui/lesson-task-quill';


type Props = {
    courseId?:number;
    examType?: string;
    refetch: () => void;
}

const examSections = ['Section A', 'Section B', 'Section C', 'Section D', 'Section E'];

export default function CreateCourseExam({ courseId, examType, refetch}: Props){
    const queryClient = useQueryClient();


    const [type, setType] = useState<TaskType>('long');
    const [points, setPoints] = useState<number>(1);
    const [question, setQuestion] = useState('');
    const [selectedExamSection, setSelectedExamSection] = useState('');
    // const [order, setOrder] = useState<number>(initial?.order ?? 1);
    const [extraData, setExtraData] = useState<any>(() => {});

    useEffect(() => {
        if (type === 'paragraph_drag'){
            setExtraData({
                paragraph: '',
                blanks: [],
                answers: [],
            });
        }

        if(type === 'drag_drop') {
            setExtraData({items: [], targets: []});
        }

        if (type === 'matching'){
            setExtraData({ left: [], right: []});
        }
    }, [type]);

    const createMutation = useMutation({
        mutationFn: createCourseExam,
        onSuccess: async () => {
            refetch();
            toast.success(`Exam question created successfully`);
            await queryClient.invalidateQueries({ queryKey: ['courseExams'] });
        },
        onError: (error: any) => {
            toast.error(error?.message || `Failed to create exam question`);
        },
    });

    const convertExtraToOptions = () => {
        if (type === 'drag_drop') {
              const d = extraData as DragDropExtraData;
        
              return [...d.items.map((t, i) => ({ option_text: t, pair_key: `I${i}` })), ...d.targets.map((t, i) => ({ option_text: t, pair_key: `T${i}` }))];
            }

        if (type === 'fill_blank'){
            return [];
        }

        if (type === 'matching') {
              const m = extraData as MatchingExtraData;
        
              const output: any[] = [];
        
              m.left.forEach((leftItem, i) => {
                output.push({
                  option_text: leftItem,
                  pair_key: String(i + 1),
                });
              });
        
              m.right.forEach((rightItem, i) => {
                output.push({
                  option_text: rightItem,
                  pair_key: String(i + 1),
                });
              });
        
              return output;
            }
        
            if (type === 'long') {
              return [];
            }
        
            if (type === 'short') {
              return [];
            }
        
            if (type === 'mcq') {
              const mcq = extraData as {
                question: string;
                options: { option_text: string; is_correct: boolean }[];
              };
        
              return mcq.options.map((opt) => ({
                option_text: opt.option_text,
                is_correct: opt.is_correct,
              }));
            }
        
            if (type === 'true_false') {
              return [];
            }
        
            if (type === 'paragraph_drag') {
              const p = extraData as ParagraphDropdownData;
              const output: any[] = [];
        
              p.blanks.forEach((blank) => {
                blank.options.forEach((opt) => {
                  if (!opt || opt.trim() === '') return;
                  output.push({
                    option_text: opt,
                    pair_key: blank.id,
                    is_correct: opt === blank.correct,
                  });
                });
              });
        
              return output;
            }
        
            return [];
    };

    const renderBuilder = () => {
          switch (type) {
              case 'long':
                return <LongAnswerBuilder initial={extraData} onChange={setExtraData} />;
        
              case 'short':
                return <ShortAnswerBuilder initial={extraData} onChange={setExtraData} />;
        
              case 'mcq':
                return <McqBuilder initial={extraData} onChange={setExtraData} />;
        
              case 'fill_blank':
                return <FillBlankBuilder onChange={setExtraData} />;
        
              case 'true_false':
                return <TrueFalseBuilder initial={extraData} onChange={setExtraData} />;
        
              case 'drag_drop':
                return <DragDropBuilder initial={extraData as DragDropExtraData} onChange={setExtraData} />;
        
              case 'matching':
                return <MatchingBuilder initial={extraData as MatchingExtraData} onChange={setExtraData} />;
              case 'paragraph_drag':
                return <ParagraphDragDropBuilder initial={extraData as ParagraphDropdownData} onChange={setExtraData} />;
              default:
                return null;
            }
    }

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const payload: CreateCourseExamPayloadType = {
          course_id: Number(courseId),
          exam_type: String(examType),
          exam_section: selectedExamSection,
          task_type: type,
          // question: question || extraData.paragraph,
          question: type === 'paragraph_drag' ? extraData.paragraph : question,
          correct_answer: extraData.correct_answer ?? null,
          extra_data: type === 'long' ? extraData.extra_data : undefined,
          points,
          // order: 1,
          options: convertExtraToOptions(),
      };
      
      await createMutation.mutateAsync(payload);
    };

    return (
         <div className="space-y-5 p-5 border  bg-white shadow w-full">
              {/* POINTS + ORDER */}
              <div className="grid grid-cols-4 gap-3">
                <div className='col-span-1'>
                  <Label className="font-medium mb-2">Exam Section</Label>
                  <Select value={selectedExamSection} onValueChange={(v) => setSelectedExamSection(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select exam section" />
                    </SelectTrigger>
                    <SelectContent>
                      {examSections.map((section) => (
                        <SelectItem key={section} value={section}>{section}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* TYPE */}
                <div className=" col-span-2">
                  <Label className="font-medium mb-2">Task Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long Question</SelectItem>
                      <SelectItem value="short">Short Question</SelectItem>
                      <SelectItem value="mcq">Multiple Choice Question</SelectItem>
                      <SelectItem value="fill_blank">Fill-in-the-Blank</SelectItem>
                      <SelectItem value="true_false">True False</SelectItem>
                      <SelectItem value="paragraph_drag">Paragraph Select</SelectItem>
                      <SelectItem value="drag_drop">Drag & Drop</SelectItem>
                      <SelectItem value="matching">Matching</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
        
                <div className="col-span-1">
                  <Label className="font-medium mb-3">Marks</Label>
                  <Input value={points} onChange={(e) => setPoints(Number(e.target.value))} />
                </div>

             

                
        
                <div className="col-span-4">
                  {type === 'paragraph_drag' ? null : (
                    <>
                      <Label id="question-label" className=" font-medium mb-2">
                        Question
                      </Label>
        
                      <LessonTaskQuill value={question} onChange={setQuestion} uploadFn={uploadImage} />
                    </>
                  )}
                </div>
        
                {/* <div>
                  <Label className="font-medium mb-2">Task Order</Label>
                  <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
                </div> */}
              </div>
        
              {/* BUILDER */}
              <div className="border rounded p-4 bg-gray-50">{renderBuilder()}</div>
        
              <Button type="submit" className="w-full" onClick={onSubmit}>
                {/* {examId ? 'Update Task' : 'Create Exam'} */}
                  Create Exam
              </Button>
            </div>
    )
}