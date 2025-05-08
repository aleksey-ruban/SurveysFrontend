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
    answer: AnswerData;
}

export type AnswerData =
    | TextAnswer
    | SingleChoiceAnswer
    | MultipleChoiceAnswer
    | RatingAnswer;

export interface TextAnswer {
    answer: string;
}

export interface SingleChoiceAnswer {
    option: string | null;
}

export interface MultipleChoiceAnswer {
    options: string[];
}

export interface RatingAnswer {
    scale: number; 
}