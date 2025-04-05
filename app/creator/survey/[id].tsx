import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { fetchResults, closeSurveyRequestFromResults, deleteSurveyFromResults } from "../../../redux/slices/resultsSlice";
import { useAppSelector } from '@/hooks/useAppSelector';
import { TouchableOpacity, Text, View, Image, ScrollView, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useAppDispatch } from "@/hooks/useAppDispatch";

const SurveyResults = () => {
    const dispatch = useAppDispatch();
    const { surveyResult, loading } = useAppSelector((state) => state.results);
    const { fetchSurveyResultError, closeSurveyError, deleteSurveyError } = useAppSelector((state) => state.error);

    const { id } = useLocalSearchParams();

    const [imageLoaded, setImageLoaded] = useState(false);
    const [loadError, setLoadError] = useState(false);

    const imageUrl = surveyResult?.imageUrl;
    const placeholderImage = require("../../../assets/images/placeholder.png");

    const [loadingImage, setLoading] = useState(true);

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
    
    const isImgUrl = surveyResult?.imageUrl !== undefined
    const imageSource = !isImgUrl || loadError || loadingImage || (surveyResult?.imageUrl === null) ? placeholderImage : { uri: imageUrl };

    const surveyId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);

    useEffect(() => {
        dispatch(fetchResults(surveyId));
    }, [dispatch, surveyId]);

    const handleToggleSurveyStatus = () => {
        if (surveyResult) {
            dispatch(closeSurveyRequestFromResults({ id: surveyResult.id, isClosed: surveyResult.isClosed }));
        }
    };

    const handleDeleteSurvey = () => {
        Alert.alert("Подтверждение", "Вы уверены, что хотите удалить опрос?", [
            { text: "Отмена", style: "cancel" },
            { text: "Удалить", onPress: () => dispatch(deleteSurveyFromResults(surveyId)) },
        ]);
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (fetchSurveyResultError) return <Text style={{ color: "red" }}>Ошибка: {fetchSurveyResultError}</Text>;
    if (!surveyResult) return <Text>Опрос не найден</Text>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.containerContent}>
                <View style={styles.headerContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.header}>{surveyResult.title}</Text>
                        {surveyResult.description && <Text style={styles.description}>{surveyResult.description}</Text>}
                    </View>
                    {surveyResult.isClosed && <Text style={[
                        styles.status,          
                        styles.statusClose
                        ]}>
                        Закрыт
                    </Text>}
                    {!surveyResult.isClosed && <Text style={[
                        styles.status,          
                        styles.statusOpen
                        ]}>
                        Открыт
                    </Text>}
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source={imageSource}
                        style={styles.image}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setLoadError(true)}
                        resizeMode="cover"
                    />
                </View>

                <Text style={styles.subHeader}>Результаты:</Text>
                {surveyResult.questions.map((question) => (
                    <View key={question.id} style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question.questionText}</Text>

                        {"answers" in question.responses && (
                            question.responses.answers.map((answer, index) => (
                                <Text key={index} style={styles.answerText}>- {answer}</Text>
                            ))
                        )}

                        {"options" in question.responses && (
                            question.responses.options.map((option, index) => (
                                <Text key={index} style={styles.optionText}>{option.option}: {option.count} голосов</Text>
                            ))
                        )}

                        {"averageRating" in question.responses && (
                            <Text style={styles.ratingText}>
                                Средний рейтинг: {question.responses.averageRating} ({question.responses.ratingsCount} оценок)
                            </Text>
                        )}
                    </View>
                ))}

                {closeSurveyError && <Text style={styles.errorText}>{closeSurveyError}</Text>}
                {deleteSurveyError && <Text style={styles.errorText}>{deleteSurveyError}</Text>}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.openCloseButton]} onPress={handleToggleSurveyStatus}>
                        <Text style={styles.buttonText}>
                            {surveyResult.isClosed ? "Открыть опрос" : "Закрыть опрос"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteSurvey}>
                        <Text style={styles.buttonText}>Удалить опрос</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 60,
        backgroundColor: "#fff",
    },
    containerContent: {
        alignSelf: "center",
        width: "50%",
        minWidth: 400,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },
    questionContainer: {
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        marginVertical: 8,
        backgroundColor: "#f9f9f9",
    },
    questionText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    answerText: {
        fontSize: 14,
        color: "#333",
        marginLeft: 10,
    },
    optionText: {
        fontSize: 14,
        color: "#444",
        marginLeft: 10,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#444",
        marginTop: 5,
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginVertical: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
    },
    openCloseButton: {
        backgroundColor: "#3579F6",
    },
    deleteButton: {
        backgroundColor: "#E53935",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    imageContainer: {
        width: "100%",
        aspectRatio: 5 / 2,
        overflow: "hidden",
        marginVertical: 20,
        borderRadius: 10,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    textContainer: {
        flex: 1,
    },
    status: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
        marginRight: 14,
    },
    statusOpen: {
        color: "green",
    },
    statusClose: {
        color: "red",
    }
});

export default SurveyResults;
