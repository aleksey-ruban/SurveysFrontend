import React, { useState } from "react";
import { View, ScrollView, Text, TextInput, Switch, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MultipleChoiceQuestion, Question, QuestionType, RatingQuestion, SingleChoiceQuestion, Survey, TextQuestion } from "../../redux/types/surveysTypes";
import { useDispatch } from "react-redux";
import { addSurvey } from "../../redux/slices/surveySlice";
import { useRouter } from "expo-router";

const CreateSurveyScreen = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [userContact, setUserContact] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);

    const dispatch = useDispatch();
    const router = useRouter();

    const handleAddQuestion = (type: QuestionType) => {
        let newQuestion: Question;

        if (type === QuestionType.TEXT) {
            newQuestion = {
                id: questions.length + 1,
                type: QuestionType.TEXT,
                questionText: "",
                required: false,
            };
        } else if (type === QuestionType.SINGLE_CHOICE) {
            newQuestion = {
                id: questions.length + 1,
                type: QuestionType.SINGLE_CHOICE,
                questionText: "",
                required: false,
                options: [""],
            };
        } else if (type === QuestionType.MULTIPLE_CHOICE) {
            newQuestion = {
                id: questions.length + 1,
                type: QuestionType.MULTIPLE_CHOICE,
                questionText: "",
                required: false,
                options: [""],
            };
        } else {
            newQuestion = {
                id: questions.length + 1,
                type: QuestionType.RATING,
                questionText: "",
                required: false,
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

    const handleSubmit = () => {
        const newSurvey: Survey = {
            id: Date.now(),
            title,
            description,
            isAnonymous,
            userContact: isAnonymous ? undefined : userContact,
            questions,
            isClosed: false,
        };
        dispatch(addSurvey(newSurvey));
        router.push("/creator");
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.containerContent}>
                <Text style={styles.header}>Создание опроса</Text>

                <TextInput style={styles.input} placeholder="Название опроса" value={title} onChangeText={setTitle} />
                <TextInput style={styles.input} placeholder="Описание (необязательно)" value={description} onChangeText={setDescription} />

                <View style={styles.switchContainer}>
                    <Text>Анонимный опрос</Text>
                    <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
                </View>

                {!isAnonymous && (
                    <TextInput style={styles.input} placeholder="Контакт для ответов" value={userContact} onChangeText={setUserContact} />
                )}

                <Text style={styles.subHeader}>Вопросы:</Text>

                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.questionContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Текст вопроса"
                                value={item.questionText}
                                onChangeText={(text) => handleUpdateQuestion(item.id, { questionText: text })}
                            />
                            <View style={styles.switchContainer}>
                                <Text>Обязательный</Text>
                                <Switch value={item.required} onValueChange={(value) => handleUpdateQuestion(item.id, { required: value })} />
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
                                                    value={option}
                                                    onChangeText={(text) => {
                                                        const newOptions = [...item.options];
                                                        newOptions[index] = text;
                                                        handleUpdateQuestion(item.id, { options: newOptions });
                                                    }}
                                                />
                                                {/* Кнопка удаления варианта */}
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
                                    {/* Кнопка добавления нового варианта */}
                                    <TouchableOpacity
                                        style={styles.addOptionButton}
                                        onPress={() => {
                                            const newOptions = [...item.options, ""];
                                            handleUpdateQuestion(item.id, { options: newOptions });
                                        }}
                                    >
                                        <Text style={styles.addOptionText}>Добавить вариант</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : item.type === QuestionType.RATING ? (
                                <Text>Оценочная шкала (1 - {item.scale})</Text>
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

                <Picker selectedValue="" onValueChange={(value) => value && handleAddQuestion(value as QuestionType)}>
                    <Picker.Item label="Добавить вопрос" value="" />
                    <Picker.Item label="Текстовый" value={QuestionType.TEXT} />
                    <Picker.Item label="Одиночный выбор" value={QuestionType.SINGLE_CHOICE} />
                    <Picker.Item label="Множественный выбор" value={QuestionType.MULTIPLE_CHOICE} />
                    <Picker.Item label="Оценка (1-5)" value={QuestionType.RATING} />
                </Picker>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Создать опрос</Text>
                </TouchableOpacity>
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
        padding: 10,
        gap: 14,
    },
});

export default CreateSurveyScreen;