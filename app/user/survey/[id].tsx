import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { Answer, SurveyUserResult } from "../../../redux/types/surveyUserTypes";
import { Question, QuestionType } from "../../../redux/types/surveysTypes";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { RootState } from "@/redux/store";
import { fetchSurveyUser } from "@/redux/slices/surveyUserSlice";

const SurveyPassScreen = () => {
    const dispatch = useAppDispatch();

    const surveyUrl = "my-survey-url";

    const survey = useAppSelector((state: RootState) => state.surveyUser.survey);
    const isCompleted = useAppSelector((state: RootState) => state.surveyUser.isCompleted);
    const loading = useAppSelector((state: RootState) => state.surveyUser.loading);
    const error = useAppSelector((state: RootState) => state.error.fetchSurveyUser);

    useEffect(() => {
        dispatch(fetchSurveyUser(surveyUrl));
    }, [dispatch, surveyUrl]);

    const isDisabled = isCompleted || survey?.isClosed;

    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [userContactValue, setUserContactValue] = useState('');

    const [imageLoaded, setImageLoaded] = useState(false);
    const [loadError, setLoadError] = useState(false);

    const imageUrl = survey?.imageUrl;
    const placeholderImage = require("../../../assets/images/placeholder.png");

    const [loadingImage, setLoading] = useState(true);

    

    const isImgUrl = survey?.imageUrl !== undefined
    const imageSource = !isImgUrl || loadError || loadingImage || (survey?.imageUrl === null) ? placeholderImage : { uri: imageUrl };

    useEffect(() => {
        if (imageUrl && !loadError) {
            setLoading(true);
            Image.prefetch(imageUrl)
                .then(() => setLoading(false))
                .catch(() => {
                    setLoading(false);
                    setLoadError(true);
                });
        } else {
            setLoading(false);
        }
    }, [imageUrl, loadError]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Загрузка опроса...</Text>
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorMessage}>Ошибка: {error}</Text>;
    }

    if (!survey) {
        return <Text style={styles.message}>Опрос не найден</Text>;
    }

    
    const handleChange = (questionId: number, value: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = () => {
        if (!survey || isDisabled) return;
    
        const missingRequired = survey.questions.some((question) => {
            if (!question.required) return false;
    
            const answer = answers[question.id];
    
            switch (question.type) {
                case QuestionType.TEXT:
                    return !answer || answer.trim() === "";
                case QuestionType.SINGLE_CHOICE:
                    return !answer;
                case QuestionType.MULTIPLE_CHOICE:
                    return !Array.isArray(answer) || answer.length === 0;
                case QuestionType.RATING:
                    return !answer || answer === 0;
                default:
                    return false;
            }
        });
    
        if (missingRequired) {
            // Можно заменить на кастомный UI, Snackbar и т.п.
            console.warn("❗ Заполните все обязательные поля!");
            alert('Заполните все обязательные поля');
            return;
        }

        if (!survey.isAnonymous && (!userContactValue || userContactValue.trim() === "")) {
            console.warn("❗ Заполните все обязательные поля!");
            alert('Заполните контактные данные');
            return;
        }
    
        // Формируем результат
        const formattedAnswers: Answer[] = survey.questions.map((question) => {
            const rawAnswer = answers[question.id];
    
            switch (question.type) {
                case QuestionType.TEXT:
                    return {
                        id: question.id,
                        type: QuestionType.TEXT,
                        answer: {
                            type: QuestionType.TEXT,
                            answer: rawAnswer || "",
                        },
                    };
                case QuestionType.SINGLE_CHOICE:
                    return {
                        id: question.id,
                        type: QuestionType.SINGLE_CHOICE,
                        answer: {
                            type: QuestionType.SINGLE_CHOICE,
                            options: rawAnswer ? rawAnswer : null,
                        },
                    };
                case QuestionType.MULTIPLE_CHOICE:
                    return {
                        id: question.id,
                        type: QuestionType.MULTIPLE_CHOICE,
                        answer: {
                            type: QuestionType.MULTIPLE_CHOICE,
                            options: (rawAnswer || []).join(","),
                        },
                    };
                case QuestionType.RATING:
                    return {
                        id: question.id,
                        type: QuestionType.RATING,
                        answer: {
                            type: QuestionType.RATING,
                            scale: rawAnswer || 0,
                        },
                    };
            }
        });
    
        const result: SurveyUserResult = {
            surveyId: survey.id,
            userContact: userContactValue || undefined,
            answers: formattedAnswers,
        };
    
        console.log("📦 Отправляем результат:", result);
        // dispatch(submitSurveyAnswers(result));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.containerContent}>
                <View style={styles.imageContainer}>
                    <Image
                        source={imageSource}
                        style={styles.image}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setLoadError(true)}
                        resizeMode="cover"
                    />
                </View>

                <Text style={styles.title}>{survey.title}</Text>
                {!!survey.description && <Text style={styles.description}>{survey.description}</Text>}

                {isDisabled && (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            {survey.isClosed
                                ? "Этот опрос закрыт"
                                : "Вы уже прошли этот опрос"}
                        </Text>
                    </View>
                )}

                {survey.userContact && !survey.isAnonymous && !isDisabled && (
                    <View style={styles.contactBox}>
                        <Text style={styles.contactLabel}>
                            Введите ваш {survey.userContact.toLowerCase()}:
                        </Text>
                        <TextInput
                            style={styles.contactInput}
                            placeholder={`Ваш ${survey.userContact.toLowerCase()}`}
                            value={userContactValue}
                            onChangeText={setUserContactValue}
                        />
                    </View>
                )}

                {survey.userContact && !survey.isAnonymous && isDisabled && userContactValue && (
                    <View style={styles.contactBox}>
                        <Text style={styles.contactLabel}>Контакт:</Text>
                        <Text>{userContactValue}</Text>
                    </View>
                )}
            </View>


            {!isDisabled && (
                <FlatList
                    style={styles.flatList}
                    contentContainerStyle={styles.flatListContent}
                    data={survey.questions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.questionCard}>
                            <Text style={styles.questionText}>
                                {item.required ? "* " : ""}{item.questionText}
                            </Text>
                            {renderInput(item, answers[item.id], handleChange)}
                        </View>
                    )}
                    scrollEnabled={false}
                />
            )}

            <View style={styles.containerContent}>
                {!isDisabled && (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? "Отправка..." : "Отправить"}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const renderInput = (
    question: Question,
    value: any,
    onChange: (id: number, value: any) => void
) => {
    switch (question.type) {
        case QuestionType.TEXT:
            return (
                <TextInput
                    style={styles.input}
                    value={value || ""}
                    onChangeText={(text) => onChange(question.id, text)}
                    placeholder="Ваш ответ"
                />
            );
        case QuestionType.SINGLE_CHOICE:
            return (
                <View>
                    {question.options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.option,
                                value === option && styles.optionSelected,
                            ]}
                            onPress={() => onChange(question.id, option)}
                        >
                            <Text>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        case QuestionType.MULTIPLE_CHOICE:
            const selected = Array.isArray(value) ? value : [];
            return (
                <View>
                    {question.options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.option,
                                selected.includes(option) && styles.optionSelected,
                            ]}
                            onPress={() => {
                                const newValue = selected.includes(option)
                                    ? selected.filter((o) => o !== option)
                                    : [...selected, option];
                                onChange(question.id, newValue);
                            }}
                        >
                            <Text>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        case QuestionType.RATING:
            return (
                <View style={styles.ratingContainer}>
                    {[...Array(question.scale)].map((_, i) => {
                        const rating = i + 1;
                        return (
                            <TouchableOpacity
                                key={rating}
                                onPress={() => onChange(question.id, rating)}
                                style={[
                                    styles.ratingItem,
                                    value === rating && styles.ratingSelected,
                                ]}
                            >
                                <Text>{rating}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        default:
            return null;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: "2%",
        paddingVertical: 30,
        marginTop: 60,
        backgroundColor: '#fff',
    },
    image: {
        width: "100%",
        height: "100%",
    },
    imageContainer: {
        width: "100%",
        aspectRatio: 5 / 2,
        overflow: "hidden",
        marginVertical: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 6,
    },
    description: {
        fontSize: 16,
        color: "#555",
        marginBottom: 12,
    },
    infoBox: {
        backgroundColor: "#eee",
        padding: 20,
        borderRadius: 8,
        marginBottom: 16,
        marginTop: 20,
    },
    infoText: {
        color: "#555",
        fontSize: 16,
        fontWeight: 500,
        textAlign: 'center',
    },
    questionBlock: {
        marginBottom: 20,
    },
    questionText: {
        fontSize: 16,
        marginBottom: 12,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    option: {
        backgroundColor: "#eee",
        padding: 10,
        marginBottom: 6,
        borderRadius: 6,
    },
    optionSelected: {
        backgroundColor: "#cce4ff",
    },
    ratingContainer: {
        flexDirection: "row",
        gap: 8,
    },
    ratingItem: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#888",
        borderRadius: 6,
        marginRight: 8,
    },
    ratingSelected: {
        backgroundColor: "#cce4ff",
        borderColor: "#3579F6",
    },
    button: {
        backgroundColor: "#3579F6",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 16,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    message: {
        padding: 20,
        textAlign: "center",
        fontSize: 16,
    },
    errorMessage: {
        padding: 20,
        textAlign: "center",
        color: "red",
        fontSize: 16,
    },
    questionCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
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
        paddingVertical: 12,
        gap: 22,
    },
    containerContent: {
        alignSelf: "center",
        width: "75%",
        minWidth: 380,
        paddingHorizontal: 8,
        paddingVertical: 12,
        gap: 0,
    },
    contactBox: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        marginBottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },

    contactLabel: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },

    contactInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#555",
    },
});

export default SurveyPassScreen;