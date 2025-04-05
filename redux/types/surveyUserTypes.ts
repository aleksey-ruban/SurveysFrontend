import { QuestionType, Survey } from "./surveysTypes";

export interface SurveyUserState {
    survey: Survey | null;
    isCompleted: boolean | null,
    loading: boolean,
}

export interface SurveyWithStatus {
    survey: Survey;
    isCompleted: boolean;
}

export interface SurveyUserResult {
    surveyId: number;
    userContact?: string;
    answers: Answer[];
}

export interface Answer {
    id: number;
    type: QuestionType;
    answer: AnswerData;
}

export type AnswerData =
    | TextAnswer
    | SingleChoiceAnswer
    | MultipleChoiceAnswer
    | RatingAnswer;

export interface TextAnswer {
    type: QuestionType.TEXT;
    answer: string;
}

export interface SingleChoiceAnswer {
    type: QuestionType.SINGLE_CHOICE;
    options: string | null;
}

export interface MultipleChoiceAnswer {
    type: QuestionType.MULTIPLE_CHOICE;
    options: string[];
}

export interface RatingAnswer {
    type: QuestionType.RATING;
    scale: number; 
}