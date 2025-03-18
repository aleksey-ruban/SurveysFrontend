import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup.string().email("Введите корректный email").required("Email обязателен"),
    password: yup.string().min(6, "Пароль должен содержать минимум 6 символов").required("Пароль обязателен"),
});

export const forgotPasswordSchema = yup.object({
    email: yup
        .string()
        .email('Неверный формат email')
        .required('Email обязателен'),
});

export const registerSchema = yup.object().shape({
    name: yup
        .string()
        .required("Имя обязателено"),
    email: yup
        .string()
        .email("Введите корректный email")
        .required("Email обязателен"),
    password: yup
        .string()
        .min(6, "Пароль должен содержать минимум 6 символов")
        .required("Пароль обязателен"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Пароли должны совпадать")
        .required("Подтверждение пароля обязательно"),
});