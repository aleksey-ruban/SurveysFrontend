export interface ErrorState {
    loginError: string | null;
    resetPasswordError: string | null;
    registerError: string | null;
    fetchSurveysError: string | null,
    fetchSurveyResultError: string | null,
    closeSurveyError: string | null,
    deleteSurveyError: string | null,
    deleteAccountError: string | null,
    fetchUserSurveysError: string | null,
    fetchSurveyUser: string | null,
    createSurveyError: string | null,
    submitSurveyAnswerError: string | null,
}