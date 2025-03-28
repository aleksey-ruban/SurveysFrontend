import { QuestionType } from "./surveysTypes";

export interface ResultsState {
    surveyResult: SurveyResult | null;
    loading: boolean,
}

export interface SurveyResult {
    id: number;
    title: string;
    description?: string;
    isAnonymous: boolean;
    userContact?: string;
    isClosed: boolean;
    imageUrl?: string;
    questions: QuestionResult[];
}

export interface QuestionResult {
    id: number;
    type: QuestionType;
    questionText: string;
    required: boolean;
    responses: ResponseData;
}

export type ResponseData =
    | TextResponse
    | SingleChoiceResponse
    | MultipleChoiceResponse
    | RatingResponse;

export interface TextResponse {
    type: QuestionType.TEXT;
    answers: string[];
}

export interface SingleChoiceResponse {
    type: QuestionType.SINGLE_CHOICE;
    options: { option: string; count: number }[];
}

export interface MultipleChoiceResponse {
    type: QuestionType.MULTIPLE_CHOICE;
    options: { option: string; count: number }[];
}

export interface RatingResponse {
    type: QuestionType.RATING;
    scale: number;
    averageRating: number;
    ratingsCount: number;
}