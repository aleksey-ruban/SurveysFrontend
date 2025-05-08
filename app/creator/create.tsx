import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, Switch, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { MultipleChoiceQuestion, Question, QuestionType, RatingQuestion, SingleChoiceQuestion, Survey, TextQuestion } from "../../redux/types/surveysTypes";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { createSurveyRequest } from "../../redux/slices/surveySlice";
import { useRouter } from "expo-router";
import Select from "react-select";
import api, { baseURL } from "@/utils/api";
import { loadUserFromStorage } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { RootState, store } from "@/redux/store";
import { UserRole } from "@/redux/types/authTypes";
import { useAppSelector } from "@/hooks/useAppSelector";
import axios from "axios";
import { clearCreateSurveyError } from "@/redux/slices/errorSlice";

const CreateSurveyScreen = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [userContact, setUserContact] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<null | QuestionType>(null);

    const createSurveyError = useAppSelector((state) => state.error.createSurveyError);

    const dispatch = useAppDispatch();
    const router = useRouter();

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
                        return;
                    } else if (authState.user.role == UserRole.USER) {
                        router.push('/user');
                    }
                } else {
                    router.push({
                        pathname: '/',
                        params: { wishPath: 'creator/create' },
                    });
                }
            } else {
                router.push('/auth/login');
            }
        };

        loadAndCheckUser();
    }, [dispatch]);

    const handleSelectChange = (selectedOption: any) => {
        if (selectedOption) {
            handleAddQuestion(selectedOption.value as QuestionType);
            setSelectedQuestion(null);
        }
    };

    const handleAddQuestion = (type: QuestionType) => {
        let newQuestion: Question;

        if (type === QuestionType.TEXT) {
            newQuestion = {
                id: questions.length + 1,
                type: QuestionType.TEXT,
                questionText: "",
                required: true,
            };
        } else if (type === QuestionType.SINGLE_CHOICE) {
            newQuestion = {
                id: questions.length + 1,
                type: QuestionType.SINGLE_CHOICE,
                questionText: "",
                required: true,
                options: [{ text: "" }],
            };
        } else if (type === QuestionType.MULTIPLE_CHOICE) {
            newQuestion = {
                id: questions.length + 1,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "",
                required: true,
                options: [{ text: "" }],
            };
        } else {
            newQuestion = {
                id: questions.length + 1,
                type: QuestionType.RATING,
                questionText: "",
                required: true,
                scale: 5,
            };
        }

        setQuestions([...questions, newQuestion]);
    };

    const handleUpdateQuestion = (id: number, updatedQuestion: Partial<Question>) => {
        setQuestions(
            questions.map((q) => {
                if (q.id !== id) return q;
                if (q.type === QuestionType.TEXT) {
                    return { ...q, ...updatedQuestion } as TextQuestion;
                } else if (q.type === QuestionType.SINGLE_CHOICE) {
                    return { ...q, ...updatedQuestion } as SingleChoiceQuestion;
                } else if (q.type === QuestionType.MULTIPLE_CHOICE) {
                    return { ...q, ...updatedQuestion } as MultipleChoiceQuestion;
                } else {
                    return { ...q, ...updatedQuestion } as RatingQuestion;
                }
            })
        );
    };

    const handleDeleteQuestion = (id: number) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const handleSubmit = async () => {
        dispatch(clearCreateSurveyError());
        if (!title.trim()) {
            alert('Название опроса не может быть пустым');
            return;
        }
        if (!isAnonymous && !userContact?.trim()) {
            alert('Требование контакта обязательно, если опрос не анонимный');
            return;
        }

        for (const question of questions) {
            if (!question.questionText.trim()) {
                alert(`${getQuestionTypeLabel(question.type)} не может быть без вопроса`);
                return;
            }

            if (
                (question.type === QuestionType.SINGLE_CHOICE || question.type === QuestionType.MULTIPLE_CHOICE) &&
                question.options.some((option) => !option.text.trim())
            ) {
                alert(`Вопрос "${question.questionText}" имеет пустой вариант`);
                return;
            }

            if (question.type === QuestionType.RATING && !question.scale) {
                alert(`Вопрос "${question.questionText}" должен иметь шкалу`);
                return;
            }
        }

        const newSurvey: Survey = {
            id: Date.now(),
            title,
            description,
            isAnonymous,
            userContact: isAnonymous ? undefined : userContact,
            questions,
            isClosed: false,
            imageUrl: uploadedUrl ? uploadedUrl : undefined,
        };
        console.log(newSurvey);
        let result = await dispatch(createSurveyRequest(newSurvey));
        if (createSurveyRequest.fulfilled.match(result)) {
            if (result.payload) {
                router.push("/creator");
            }
        }
    };

    const getQuestionTypeLabel = (type: QuestionType) => {
        switch (type) {
            case QuestionType.TEXT:
                return "Текстовый вопрос";
            case QuestionType.SINGLE_CHOICE:
                return "Одиночный выбор";
            case QuestionType.MULTIPLE_CHOICE:
                return "Множественный выбор";
            case QuestionType.RATING:
                return "Оценка по шкале";
            default:
                return "Неизвестный тип";
        }
    };

    const options = [
        { label: "Текстовый", value: "text" },
        { label: "Одиночный выбор", value: "single_choice" },
        { label: "Множественный выбор", value: "multiple_choice" },
        { label: "Оценка (1-5)", value: "rating" },
    ];


    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setUploadedUrl(null);
            setImage(result.assets[0].uri);
            uploadImage(result.assets[0].uri);
        }
    };

    const authState = useAppSelector((state: RootState) => state.auth);

    const uploadImage = async (uri: string) => {
        setUploading(true);
        setError(null);

        const formData = new FormData();

        const isDataUrl = uri.startsWith('data:image');
        
        if (isDataUrl) {
            const base64Data = uri.split(',')[1];
        
            const mimeType = uri.match(/data:(image\/[a-zA-Z]*);base64/);
            const fileType = mimeType ? mimeType[1] : 'image/jpeg';
        
            const blob = await fetch(`data:${fileType};base64,${base64Data}`).then(res => res.blob());
            const file = new File([blob], `image.${fileType.split('/')[1]}`, { type: fileType });
        
            formData.append('image', file);
        } else {
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename ?? '');
            const type = match ? `image/${match[1]}` : `image/jpeg`;
        
            formData.append('image', {
                uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
                name: filename,
                type,
            } as any);
        }

        try {
            const token = authState.token;

            if (!token) {
                throw new Error("Нет токена");
            }

            const api1 = axios.create({
                baseURL: baseURL,
                headers: { Authorization: `Token ${token}`, },
                timeout: 4000,
                withCredentials: true,
            });

            const response = await api1.post("/creators/upload", formData);
            setUploadedUrl(response.data.imageUrl);
        } catch (error) {
            setError("Ошибка загрузки изображения");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.containerContent}>
                <Text style={styles.header}>Создание опроса</Text>

                <TextInput style={styles.input} placeholder="Название опроса" value={title} onChangeText={setTitle} />
                <TextInput style={styles.input} placeholder="Описание (необязательно)" value={description} onChangeText={setDescription} />

                <View style={styles.containerImage}>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.buttonText}>Выбрать изображение</Text>
                    </TouchableOpacity>

                    {image && <Image source={{ uri: image }} style={styles.image} />}

                    {uploading && <ActivityIndicator size="small" color="#3579F6" />}
                    {uploadedUrl && <Text style={styles.uploadedUrl}>Изображение загружено</Text>}
                    {error && <Text style={styles.error}>{error}</Text>}
                </View>

                <View style={styles.switchContainer}>
                    <Text>Анонимный опрос</Text>
                    <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
                </View>

                {!isAnonymous && (
                    <TextInput style={styles.input} placeholder="Какой контакт необходимо предоставить" value={userContact} onChangeText={setUserContact} />
                )}

                <Text style={styles.subHeader}>Вопросы:</Text>

                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionType}>{getQuestionTypeLabel(item.type)}</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Текст вопроса"
                                value={item.questionText}
                                onChangeText={(text) => handleUpdateQuestion(item.id, { questionText: text })}
                            />
                            <View style={styles.switchContainer}>
                                <Text>Обязательный</Text>
                                <Switch
                                    value={item.required}
                                    onValueChange={(value) => handleUpdateQuestion(item.id, { required: value })}
                                />
                            </View>

                            {(item.type === QuestionType.SINGLE_CHOICE || item.type === QuestionType.MULTIPLE_CHOICE) ? (
                                <View>
                                    <FlatList
                                        data={item.options}
                                        keyExtractor={(option, index) => `${item.id}-${index}`}
                                        renderItem={({ item: option, index }) => (
                                            <View style={styles.optionContainer}>
                                                <TextInput
                                                    style={styles.optionInput}
                                                    placeholder={`Вариант ${index + 1}`}
                                                    value={option.text}
                                                    onChangeText={(text) => {
                                                        const newOptions = [...item.options];
                                                        newOptions[index] = {text: text};
                                                        handleUpdateQuestion(item.id, { options: newOptions });
                                                    }}
                                                />
                                                <TouchableOpacity
                                                    style={styles.deleteOptionButton}
                                                    onPress={() => {
                                                        const newOptions = item.options.filter((_, i) => i !== index);
                                                        handleUpdateQuestion(item.id, { options: newOptions });
                                                    }}
                                                >
                                                    <Image
                                                        source={require('../../assets/images/trash.png')}
                                                        style={styles.deleteOptionIcon}
                                                        resizeMode="contain"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                    <TouchableOpacity
                                        style={styles.addOptionButton}
                                        onPress={() => {
                                            const newOptions = [...item.options, {text: ""}];
                                            handleUpdateQuestion(item.id, { options: newOptions });
                                        }}
                                    >
                                        <Text style={styles.addOptionText}>Добавить вариант</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : item.type === QuestionType.RATING ? (
                                <View style={styles.ratingContainer}>
                                    <Text>Оценочная шкала (1 - {item.scale})</Text>
                                    <TextInput
                                        style={styles.scaleInput}
                                        placeholder="Макс. значение"
                                        value={item.scale.toString()}
                                        keyboardType="numeric"
                                        onChangeText={(text) => {
                                            const numericValue = parseInt(text, 10);
                                            if (!isNaN(numericValue) && numericValue > 0) {
                                                handleUpdateQuestion(item.id, { scale: numericValue });
                                            }
                                        }}
                                    />
                                </View>
                            ) : null}

                            <TouchableOpacity onPress={() => handleDeleteQuestion(item.id)} style={styles.deleteQuestionButtonContainer}>
                                <Text style={styles.deleteText}>Удалить вопрос</Text>
                                <Image
                                    source={require('../../assets/images/trash.png')}
                                    style={styles.deleteQuestionIcon}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />

                <Select
                    options={options}
                    placeholder="Добавить вопрос"
                    value={options.find(option => option.value === selectedQuestion) || null}
                    onChange={handleSelectChange}
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: "#fff",
                            borderColor: "#ccc",
                            borderRadius: "5px",
                            padding: "4px",
                            marginTop: 16,
                            fontSize: "14px",
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        }),
                        option: (base, { isFocused }) => ({
                            ...base,
                            backgroundColor: isFocused ? "#f0f0f0" : "#fff",
                            color: "#333",
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        }),
                        singleValue: (base) => ({
                            ...base,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        }),
                    }}
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Создать опрос</Text>
                </TouchableOpacity>
                {createSurveyError && <Text style={styles.errorText}>{createSurveyError}</Text>}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        padding: 20,
        marginTop: 60,
        backgroundColor: "#fff",
    },
    containerContent: {
        alignSelf: "center",
        width: "50%",
        minWidth: 400,
        flexGrow: 1,
        marginBottom: 300,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 30,
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    optionInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        flexGrow: 1,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    questionContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        marginVertical: 5,
    },
    deleteText: {
        color: "red",
        fontWeight: "500",
        marginVertical: 0,
    },
    submitButton: {
        backgroundColor: "#3579F6",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 16,
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
    },
    addOptionButton: {
        backgroundColor: "#3579F6",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    addOptionText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    optionContainer: {
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    deleteOptionButton: {
        height: 40,
        width: 40,
        marginLeft: 10,
    },
    deleteOptionIcon: {
        width: 40,
        height: 40,
        backgroundColor: "red",
        borderRadius: 5,
        borderWidth: 10,
        borderColor: "red",
        borderStyle: "solid",
    },
    deleteQuestionIcon: {
        width: 44,
        height: 36,
        backgroundColor: "red",
        borderRadius: 5,
        borderWidth: 10,
        borderColor: "red",
        borderStyle: "solid",
    },
    deleteQuestionButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        padding: 8,
        gap: 14,
        width: 'auto',
        alignSelf: 'flex-start',
    },
    questionType: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    ratingContainer: {
        marginTop: 10,
    },
    scaleInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 8,
        marginTop: 5,
        width: 80,
        textAlign: "center",
    },
    containerImage: {
        alignItems: "center",
        padding: 12,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        backgroundColor: "#fff",
        width: "100%",
        alignSelf: "center",
    },
    button: {
        backgroundColor: "#3579F6",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "500",
    },
    image: {
        width: "90%",
        aspectRatio: 5 / 3,
        borderRadius: 10,
        marginVertical: 20,
    },
    uploadedUrl: {
        color: "green",
        fontSize: 12,
        marginTop: 10,
    },
    error: {
        color: "red",
        fontSize: 14,
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        fontWeight: 500,
        marginTop: 0,
    },
});

export default CreateSurveyScreen;