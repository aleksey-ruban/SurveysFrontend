import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: "2%",
        paddingVertical: 30,
        marginTop: 60,
        backgroundColor: '#fff',
    },
    emailText: {
        fontSize: 20,
        fontWeight: '700',
    },
    createButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 8,
    },
    createButtonText: {
        color: "#3579F6",
        fontSize: 16,
        fontWeight: '500',
        marginRight: 10,
    },
    createButtonIcon: {
        width: 44,
        height: 36,
        backgroundColor: "#3579F6",
        borderRadius: 12,
        borderWidth: 8,
        borderColor: "#3579F6",
        borderStyle: "solid",
    },
    surveysTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: "auto",
    },
    loadingText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 60,
    },
    viewContainer: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 60,
    },
    flatList: {
        flex: 1,
        width: "100%",
        marginTop: 30,
        paddingVertical: 6,
    },
    flatListContent: {
        alignSelf: "center",
        width: "75%",
        minWidth: 380,
        flexGrow: 1,
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
});