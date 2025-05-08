import React, { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, Button } from "react-native";
import { deleteAccount, loadUserFromStorage, logout, logoutUser, } from "../../redux/slices/authSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchUserSurveys } from "@/redux/slices/surveySlice";
import { clearFetchUserSurveysError } from "@/redux/slices/errorSlice";
import UserSurveyCard from "@/components/UserSurveyCard";
import { store } from "@/redux/store";
import { UserRole } from "@/redux/types/authTypes";

const UserProfile = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const surveys = useAppSelector((state) => state.survey.userSurveys);

    const router = useRouter();

    useEffect(() => {
        dispatch(fetchUserSurveys());
    }, [dispatch]);

    useEffect(() => {
        const loadAndCheckUser = async () => {
            let authState = store.getState().auth;
            if (authState.token == null) {
                const resultAction = await dispatch(loadUserFromStorage());
                authState = store.getState().auth;
            }

            if (authState.token !== null) {
                if (authState.user !== null) {
                    if (authState.user.role == UserRole.CREATOR) {
                        router.push('/creator');
                    } else if (authState.user.role == UserRole.USER) {
                        return;
                    }
                } else {
                    router.push({
                        pathname: '/',
                        params: { wishPath: 'user/profile' },
                    });
                }
            } else {
                router.push('/auth/login');
            }
        };

        loadAndCheckUser();
    }, [dispatch]);

    useEffect(() => {
        dispatch(clearFetchUserSurveysError());
        return () => {
            dispatch(clearFetchUserSurveysError());
        };
    }, [dispatch]);

    const handleLogout = async () => {
        try {
            let result = await dispatch(logoutUser());
            if (logoutUser.fulfilled.match(result)) {
                router.push('/auth/login');
            }
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    };


    const handleDeleteAccount = async () => {
        const confirmation = window.confirm("Вы уверены, что хотите удалить аккаунт? Это действие необратимо.");

        if (confirmation) {
            const result = await dispatch(deleteAccount());
            if (deleteAccount.fulfilled.match(result)) {
                dispatch(logout());
                router.push('/auth/login');
            }
        } else {
            console.log("Удаление аккаунта отменено.");
        }
    };

    const { width } = useWindowDimensions();
    const [numColumns, setNumColumns] = useState(width < 600 ? 1 : 2);

    useEffect(() => {
        setNumColumns(width < 1000 ? 1 : 2);
    }, [width]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}>
                <Text style={styles.name}>С возвращением, {user?.name}!</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <Text style={styles.sectionTitle}>Пройденные опросы</Text>
            <FlatList
                style={styles.flatList}
                contentContainerStyle={styles.flatListContent}
                data={surveys}
                key={numColumns}
                numColumns={numColumns}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <UserSurveyCard survey={item} onPress={() => router.push(`/user/survey/${item.id}`)} />
                )}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Выйти</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                    <Text style={styles.buttonText}>Удалить аккаунт</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 60,
        backgroundColor: "#F8F9FA",
    },
    profileContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
    },
    email: {
        fontSize: 16,
        color: "gray",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
        width: "75%",
        marginHorizontal: "auto",
        paddingHorizontal: 20,
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: "#3579F6",
        padding: 10,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
        marginRight: 20,
    },
    deleteButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 21,
        fontWeight: "bold",
        marginBottom: 10,
        width: "75%",
        marginHorizontal: "auto",
        paddingHorizontal: 20,
    },
    emptyText: {
        textAlign: "center",
        color: "gray",
        marginTop: 20,
    },
    flatList: {
        flex: 1,
        width: "100%",
        marginTop: 0,
        paddingVertical: 0,
    },
    flatListContent: {
        alignSelf: "center",
        width: "75%",
        minWidth: 380,
        flexGrow: 1,
        paddingHorizontal: 8,
        paddingVertical: 0,
    },
});

export default UserProfile;