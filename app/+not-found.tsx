import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function NotFound() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Страница не найдена 🔍</Text>
            <Text style={styles.subtitle}>Проверьте адрес или вернитесь назад.</Text>

            <Pressable style={styles.button} onPress={() => router.push("/")}>
                <Text style={styles.buttonText}>Вернуться на сайт</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#3579F6",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
});