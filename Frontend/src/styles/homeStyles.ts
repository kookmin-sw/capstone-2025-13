import { StyleSheet } from "react-native";

const homeStyles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 100,
        backgroundColor: "#f3f4f6",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 4,
    },
    button: {
        marginTop: 12,
        backgroundColor: "#3b82f6",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    outlineButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    outlineButtonText: {
        color: "#333",
    },
});

export default homeStyles;