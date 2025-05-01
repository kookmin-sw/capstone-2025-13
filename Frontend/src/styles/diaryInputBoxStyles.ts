import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 20,
        marginHorizontal: 24,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        minHeight: 120,
        fontSize: 14,
        textAlignVertical: "top",
    },
    caption: {
        marginTop: 12,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
});

export default styles;
