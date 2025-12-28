import DragDropBuilder from "./DragDropBuilder";
import FillBlankBuilder from "./FillBlankBuilder";
import MatchingBuilder from "./MatchingBuilder";
import ShortAnswerBuilder from "./ShortAnswerBuilder";
import LongAnswerBuilder from "./LongAnswerBuilder";
import McqBuilder from "./McqBuilder";
import TrueFalseBuilder from "./TrueFalseBuilder";
import DragDropWithBlankBuilder from "./DragDropWithBlankBuilder";
import ParagraphDragDropBuilder from "./ParagraphDragDropBuilder";

import type { DragDropExtraData, MatchingExtraData, FillBlankExtraData, LongAnswerExtraData, DragDropWithBlankExtraData } from "@/types/task";

export {
    MatchingBuilder,
    DragDropBuilder,
    FillBlankBuilder,
    ShortAnswerBuilder,
    LongAnswerBuilder,
    McqBuilder,
    TrueFalseBuilder,
    DragDropWithBlankBuilder,
    ParagraphDragDropBuilder
};

export type BuilderData = DragDropExtraData | MatchingExtraData | FillBlankExtraData | LongAnswerExtraData | DragDropWithBlankExtraData;