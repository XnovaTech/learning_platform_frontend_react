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
    question: string;
    items: string[];
    targets: string[];
}

export interface MatchingExtraData {
    question: string
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