export interface SurveysState {
    surveys: Array<Survey>;
    userSurveys: Array<Survey>,
    loading: boolean,
}

export interface Survey {
    id: number;
    title: string;
    description?: string;
    isAnonymous: boolean;
    userContact?: string;
    questions: Question[];
    isClosed: boolean;
    imageUrl?: string;
}

export enum QuestionType {
    TEXT = "text",
    SINGLE_CHOICE = "single_choice",
    MULTIPLE_CHOICE = "multiple_choice",
    RATING = "rating"
}

interface BaseQuestion {
    id: number;
    type: QuestionType;
    questionText: string;
    required: boolean;
}

export interface TextQuestion extends BaseQuestion {
    type: QuestionType.TEXT;
}

export interface SingleChoiceQuestion extends BaseQuestion {
    type: QuestionType.SINGLE_CHOICE;
    options: Option[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: QuestionType.MULTIPLE_CHOICE;
    options: Option[];
}

export interface RatingQuestion extends BaseQuestion {
    type: QuestionType.RATING;
    scale: number;
}

export interface Option {
    text: string
}

export type Question = TextQuestion | SingleChoiceQuestion | MultipleChoiceQuestion | RatingQuestion;