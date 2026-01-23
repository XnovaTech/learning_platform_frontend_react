import type { DragDropExtraData, MatchingExtraData, ParagraphDropdownData, TaskType } from "@/types/task";
import DragDropBuilder from "./DragDropBuilder";
import FillBlankBuilder from "./FillBlankBuilder";
import LongAnswerBuilder from "./LongAnswerBuilder";
import McqBuilder from "./McqBuilder";
import ShortAnswerBuilder from "./ShortAnswerBuilder";
import TrueFalseBuilder from "./TrueFalseBuilder";
import MatchingBuilder from "./MatchingBuilder";
import ParagraphDragDropBuilder from "./ParagraphDragDropBuilder";


export default function RenderBuilder(taskType: TaskType, extraData: any, setExtraData: (data: any) => void) {
    switch (taskType) {
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
  };