import { SurveyResult } from "../types/resultsTypes";
import { Survey, QuestionType } from "../types/surveysTypes";

export const surveys: Survey[] = [
    {
        id: 1,
        title: "Обратная связь о качестве сервиса",
        description: "Ваше мнение поможет нам стать лучше!",
        isAnonymous: true,
        userContact: "Телефон",
        isClosed: false,
        imageUrl: "https://png.pngtree.com/thumb_back/fw800/background/20230610/pngtree-picture-of-a-blue-bird-on-a-black-background-image_2937385.jpg",
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
                options: [{text: "Реклама"}, {text: "Совет друга"}, {text: "Случайно наткнулся"}]
            },
            {
                id: 3,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какими функциями вы чаще всего пользуетесь?",
                required: false,
                options: [{text: "Поиск"}, {text: "Отзывы"}, {text: "Фильтры"}, {text: "Личный кабинет"}]
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
        imageUrl: "https://png.pngtree.com/thumb_back/fw800/background/20230610/pngtree-picture-of-a-blue-bird-on-a-black-background-image_2937385.jpg",
        questions: [
            {
                id: 1,
                type: QuestionType.SINGLE_CHOICE,
                questionText: "Как вам новый дизайн?",
                required: true,
                options: [{text: "Отличный"}, {text: "Хороший"}, {text: "Нейтральный"}, {text: "Плохой"}]
            },
            {
                id: 2,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какие элементы дизайна вам понравились?",
                required: false,
                options: [{text: "Шрифты"}, {text: "Цветовая схема"}, {text: "Иконки"}, {text: "Удобство навигации"}]
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
                options: [{text: "Реклама"}, {text: "Совет друга"}, {text: "Случайно наткнулся"}]
            },
            {
                id: 3,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какими функциями вы чаще всего пользуетесь?",
                required: false,
                options: [{text: "Поиск"}, {text: "Отзывы"}, {text: "Фильтры"}, {text: "Личный кабинет"}]
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
                options: [{text: "Отличный"}, {text: "Хороший"}, {text: "Нейтральный"}, {text: "Плохой"}]
            },
            {
                id: 2,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какие элементы дизайна вам понравились?",
                required: false,
                options: [{text: "Шрифты"}, {text: "Цветовая схема"}, {text: "Иконки"}, {text: "Удобство навигации"}]
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
                options: [{text: "Реклама"}, {text: "Совет друга"}, {text: "Случайно наткнулся"}]
            },
            {
                id: 3,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какими функциями вы чаще всего пользуетесь?",
                required: false,
                options: [{text: "Поиск"}, {text: "Отзывы"}, {text: "Фильтры"}, {text: "Личный кабинет"}]
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
                options: [{text: "Отличный"}, {text: "Хороший"}, {text: "Нейтральный"}, {text: "Плохой"}]
            },
            {
                id: 2,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "Какие элементы дизайна вам понравились?",
                required: false,
                options: [{text: "Шрифты"}, {text: "Цветовая схема"}, {text: "Иконки"}, {text: "Удобство навигации"}]
            }
        ]
    }
];

export const surveyResult: SurveyResult = {
    id: 1,
    isAnonymous: false,
    isClosed: false,
    title: "Опрос по дизайну",
    description: "Оцените наши изменения",
    imageUrl: "https://png.pngtree.com/thumb_back/fw800/background/20230610/pngtree-picture-of-a-blue-bird-on-a-black-background-image_2937385.jpg",
    userContact: "Телефон",
    questions: [
        {
            id: 1,
            questionText: "Какие у вас впечатления?",
            required: true,
            type: QuestionType.TEXT,
            responses: {
                type: QuestionType.TEXT,
                answers: [
                    "Классно курто, всего хватило",
                    "Очень красиво!",
                    "Хочеться красочнее",
                    "Больше дизайна сделайте"
                ]
            }
        },
        {
            id: 2,
            questionText: "Что вы хотите изменить?",
            required: true,
            type: QuestionType.SINGLE_CHOICE,
            responses: {
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    {
                        option: "Дизайн",
                        count: 12
                    },
                    {
                        option: "Компоненты",
                        count: 2
                    },
                    {
                        option: "Ux",
                        count: 3
                    },
                    {
                        option: "Всё",
                        count: 1
                    },
                ]
            }
        },
        {
            id: 3,
            questionText: "Что вам понравилось?",
            required: true,
            type: QuestionType.MULTIPLE_CHOICE,
            responses: {
                type: QuestionType.MULTIPLE_CHOICE,
                options: [
                    {
                        option: "Дизайн",
                        count: 12
                    },
                    {
                        option: "Компоненты",
                        count: 2
                    },
                    {
                        option: "Ux",
                        count: 3
                    },
                    {
                        option: "Всё",
                        count: 1
                    },
                ]
            }
        },
        {
            id: 4,
            questionText: "Оцените нашу работу",
            required: true,
            type: QuestionType.RATING,
            responses: {
                type: QuestionType.RATING,
                scale: 5,
                averageRating: 4.3,
                ratingsCount: 17,
            }
        }
    ]
}