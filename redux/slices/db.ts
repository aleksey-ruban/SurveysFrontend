import { Survey, QuestionType } from "../types/surveysTypes";

export const surveys: Survey[] = [
    {
        id: 1,
        title: "Обратная связь о качестве сервиса",
        description: "Ваше мнение поможет нам стать лучше!",
        isAnonymous: true,
        isClosed: false,
        questions: [
            {
                id: 1,
                type: QuestionType.TEXT,
                questionText: "Что вам больше всего нравится в нашем сервисе?",
                required: true
            },
            {
                id: 2,
                type: QuestionType.SINGLE_CHOICE,
                questionText: "Как вы узнали о нас?",
                required: true,
                options: ["Реклама", "Совет друга", "Случайно наткнулся"]
            },
            {
                id: 3,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какими функциями вы чаще всего пользуетесь?",
                required: false,
                options: ["Поиск", "Отзывы", "Фильтры", "Личный кабинет"]
            },
            {
                id: 4,
                type: QuestionType.RATING,
                questionText: "Оцените наш сервис от 1 до 10",
                required: true,
                scale: 10
            }
        ]
    },
    {
        id: 2,
        title: "Опрос о доставке",
        description: "Оставьте отзыв о нашей доставке",
        isAnonymous: false,
        userContact: "user@example.com",
        isClosed: false,
        questions: [
            {
                id: 1,
                type: QuestionType.RATING,
                questionText: "Оцените скорость доставки",
                required: true,
                scale: 10
            },
            {
                id: 2,
                type: QuestionType.TEXT,
                questionText: "Какие у вас есть пожелания по улучшению доставки?",
                required: false
            }
        ]
    },
    {
        id: 3,
        title: "Тестирование нового интерфейса",
        description: "Помогите нам оценить обновленный дизайн",
        isAnonymous: true,
        isClosed: true, // Опрос уже завершён
        questions: [
            {
                id: 1,
                type: QuestionType.SINGLE_CHOICE,
                questionText: "Как вам новый дизайн?",
                required: true,
                options: ["Отличный", "Хороший", "Нейтральный", "Плохой"]
            },
            {
                id: 2,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какие элементы дизайна вам понравились?",
                required: false,
                options: ["Шрифты", "Цветовая схема", "Иконки", "Удобство навигации"]
            }
        ]
    },
    {
        id: 4,
        title: "Обратная связь о качестве сервиса",
        description: "Ваше мнение поможет нам стать лучше!",
        isAnonymous: true,
        isClosed: false,
        questions: [
            {
                id: 1,
                type: QuestionType.TEXT,
                questionText: "Что вам больше всего нравится в нашем сервисе?",
                required: true
            },
            {
                id: 2,
                type: QuestionType.SINGLE_CHOICE,
                questionText: "Как вы узнали о нас?",
                required: true,
                options: ["Реклама", "Совет друга", "Случайно наткнулся"]
            },
            {
                id: 3,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какими функциями вы чаще всего пользуетесь?",
                required: false,
                options: ["Поиск", "Отзывы", "Фильтры", "Личный кабинет"]
            },
            {
                id: 4,
                type: QuestionType.RATING,
                questionText: "Оцените наш сервис от 1 до 10",
                required: true,
                scale: 10
            }
        ]
    },
    {
        id: 5,
        title: "Опрос о доставке",
        description: "Оставьте отзыв о нашей доставке",
        isAnonymous: false,
        userContact: "user@example.com",
        isClosed: false,
        questions: [
            {
                id: 1,
                type: QuestionType.RATING,
                questionText: "Оцените скорость доставки",
                required: true,
                scale: 10
            },
            {
                id: 2,
                type: QuestionType.TEXT,
                questionText: "Какие у вас есть пожелания по улучшению доставки?",
                required: false
            }
        ]
    },
    {
        id: 6,
        title: "Тестирование нового интерфейса",
        description: "Помогите нам оценить обновленный дизайн",
        isAnonymous: true,
        isClosed: true, // Опрос уже завершён
        questions: [
            {
                id: 1,
                type: QuestionType.SINGLE_CHOICE,
                questionText: "Как вам новый дизайн?",
                required: true,
                options: ["Отличный", "Хороший", "Нейтральный", "Плохой"]
            },
            {
                id: 2,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какие элементы дизайна вам понравились?",
                required: false,
                options: ["Шрифты", "Цветовая схема", "Иконки", "Удобство навигации"]
            }
        ]
    },
    {
        id: 7,
        title: "Обратная связь о качестве сервиса",
        description: "Ваше мнение поможет нам стать лучше!",
        isAnonymous: true,
        isClosed: false,
        questions: [
            {
                id: 1,
                type: QuestionType.TEXT,
                questionText: "Что вам больше всего нравится в нашем сервисе?",
                required: true
            },
            {
                id: 2,
                type: QuestionType.SINGLE_CHOICE,
                questionText: "Как вы узнали о нас?",
                required: true,
                options: ["Реклама", "Совет друга", "Случайно наткнулся"]
            },
            {
                id: 3,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какими функциями вы чаще всего пользуетесь?",
                required: false,
                options: ["Поиск", "Отзывы", "Фильтры", "Личный кабинет"]
            },
            {
                id: 4,
                type: QuestionType.RATING,
                questionText: "Оцените наш сервис от 1 до 10",
                required: true,
                scale: 10
            }
        ]
    },
    {
        id: 8,
        title: "Опрос о доставке",
        description: "Оставьте отзыв о нашей доставке",
        isAnonymous: false,
        userContact: "user@example.com",
        isClosed: false,
        questions: [
            {
                id: 1,
                type: QuestionType.RATING,
                questionText: "Оцените скорость доставки",
                required: true,
                scale: 10
            },
            {
                id: 2,
                type: QuestionType.TEXT,
                questionText: "Какие у вас есть пожелания по улучшению доставки?",
                required: false
            }
        ]
    },
    {
        id: 9,
        title: "Тестирование нового интерфейса",
        description: "Помогите нам оценить обновленный дизайн",
        isAnonymous: true,
        isClosed: true, // Опрос уже завершён
        questions: [
            {
                id: 1,
                type: QuestionType.SINGLE_CHOICE,
                questionText: "Как вам новый дизайн?",
                required: true,
                options: ["Отличный", "Хороший", "Нейтральный", "Плохой"]
            },
            {
                id: 2,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какие элементы дизайна вам понравились?",
                required: false,
                options: ["Шрифты", "Цветовая схема", "Иконки", "Удобство навигации"]
            }
        ]
    }
];