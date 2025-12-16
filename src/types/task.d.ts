export type TaskType = 
| "mcq"
| "short"
| "long"
| "drag_drop"
| "matching"
| "fill_blank"
| "true_false";




export interface LessonTaskOptionType {
    id?: number;
    task_id?: number;

    option_text: string;
    is_correct?: boolean;
    pair_key?: string | null;
    order?: number | null
}

export interface DragDropExtraData {
    items: string[];
    targets: string[];
}

type DragDropWithBlankExtraData = {
  paragraph: string;
  blanks: Blank[];
  items: string[];
};

export interface MatchingExtraData {
    left: string[];
    right: string[];
    matches?: Record<string, string>;
}

export interface FillBlankExtraData {
    text: string;
    answers: string[];
}

export interface LongAnswerExtraData {
    min_word_count?: number;
}

export type ExtraData = 
    | DragDropExtraData
    | MatchingExtraData
    | FillBlankExtraData
    | LongAnswerExtraData
    | Record<string, any>;

export interface LessonTaskType {
    id: number;
    lesson_id: number;

    task_type: TaskType;
    question: string | null;
    correct_answer?: string | null;
    extra_data ?: ExtraData | null;

    points?: number | null;
    order?: number | null;

    options ?: LessonTaskOption[];

    created_at?: string;
    updated_at?: string;

    targets?: { id: string; text: string }[];
    items?: { id: string; text: string }[];

    left?: { id: string; text: string }[];
    right?: { id: string; text: string }[];
}


export interface CreateLessonTaskPayloadType {
    lesson_id: number;
    task_type: TaskType;
    question?: string | null;
    correct_answer?: string | null;
    extra_data?: ExtraData | null;
    points?: number | null;
    order?: number | null;

    options?: {
        option_text: string;
        is_correct?: boolean;
        pair_key?: string | null;
        order?: number | null;
    }[];
}

export interface UpdateLessonTaskPayloadType extends Partial<CreateLessonTaskPayloadType>{}