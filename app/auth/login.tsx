import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUser } from "../../redux/slices/authSlice";
import { TextInput, TouchableOpacity, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import styles from "../../components/styles/login-screen";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect } from "react";
import { clearLoginError } from "@/redux/slices/errorSlice";
import { loginSchema } from "./validationSchema";

export default function LoginScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const loginError = useAppSelector((state) => state.error.loginError);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: { email: string; password: string }) => {
        dispatch(clearLoginError());
        const resultAction = await dispatch(loginUser(data));

        if (loginUser.fulfilled.match(resultAction)) {
            router.push("/");
        }
    };

    useEffect(() => {
        dispatch(clearLoginError());
        return () => {
            dispatch(clearLoginError());
        };
    }, [dispatch]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Вход</Text>

            <View style={styles.formContainer}>
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

                {loginError && <Text style={styles.errorText}>{loginError}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Войти</Text>
                </TouchableOpacity>

                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => router.push("/auth/register")}>
                        <Text style={styles.linkText}>Регистрация</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
                        <Text style={styles.linkText}>Забыли пароль?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}