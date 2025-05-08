import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from './validationSchema';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import styles from '../../components/styles/forgot-password-screen';
import { clearResetPasswordError } from '@/redux/slices/errorSlice';
import { loadUserFromStorage, resetPassword } from '@/redux/slices/authSlice';
import { store } from '@/redux/store';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const resetPasswordError = useAppSelector((state) => state.error.resetPasswordError);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: { email: string }) => {
        const resultAction = await dispatch(resetPassword(data));
        if (resetPassword.fulfilled.match(resultAction)) {
            router.push("/auth/login");
        }
    };

    useEffect(() => {
        const loadAndCheckUser = async () => {
            let authState = store.getState().auth;
            if (authState.token == null) {
                const resultAction = await dispatch(loadUserFromStorage());
                authState = store.getState().auth;
            }

            if (authState.token !== null) {
                router.push('/');
            }
        };
        loadAndCheckUser();
    }, [dispatch]);

    useEffect(() => {
        dispatch(clearResetPasswordError());
        return () => {
            dispatch(clearResetPasswordError());
        };
    }, [dispatch]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Восстановление пароля</Text>

            <View style={styles.formContainer}>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Введите ваш Email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                {resetPasswordError && <Text style={styles.errorText}>{resetPasswordError}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Отправить запрос</Text>
                </TouchableOpacity>

                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => router.push("/auth/login")}>
                        <Text style={styles.linkText}>Войти</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/auth/register")}>
                        <Text style={styles.linkText}>Регистрация</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
