import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import styles from '../../components/styles/register-screen';
import { registerSchema } from './validationSchema';
import { registerUser } from '../../redux/slices/authSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { clearRegisterError } from '@/redux/slices/errorSlice';
import { RegisterPayload } from '@/redux/types/authTypes';

export default function RegisterScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const registerError = useAppSelector((state) => state.error.registerError);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data: { name: string, email: string, password: string, confirmPassword: string }) => {
        dispatch(clearRegisterError());

        if (!selectedRole) {
            return;
        }
        const formData: RegisterPayload = { ...data, role: selectedRole };
        let result = await dispatch(registerUser(formData));
    };

    useEffect(() => {
        dispatch(clearRegisterError());
        return () => {
            dispatch(clearRegisterError());
        };
    }, [dispatch]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация</Text>

            <View style={styles.formContainer}>

                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Имя"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="default"
                            autoCapitalize="none"
                        />
                    )}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Пароль"
                            secureTextEntry
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Подтвердите пароль"
                            secureTextEntry
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

                <Text style={styles.label}>Выберите роль:</Text>
                <View style={styles.roleContainer}>
                    <TouchableOpacity
                        style={[styles.roleButton, selectedRole === 'user' && styles.roleButtonSelected]}
                        onPress={() => setSelectedRole('user')}
                    >
                        <Text style={[styles.roleText, selectedRole === 'user' && styles.roleTextSelected]}>Пользователь</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.roleButton, selectedRole === 'creator' && styles.roleButtonSelected]}
                        onPress={() => setSelectedRole('creator')}
                    >
                        <Text style={[styles.roleText, selectedRole === 'creator' && styles.roleTextSelected]}>Создатель</Text>
                    </TouchableOpacity>
                </View>
                {!selectedRole && <Text style={styles.errorText}>Необходимо выбрать роль</Text>}

                {registerError && <Text style={styles.errorText}>{registerError}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Зарегистрироваться</Text>
                </TouchableOpacity>

                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                        <Text style={styles.linkText}>Войти</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
                        <Text style={styles.linkText}>Забыли пароль?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    );
}
