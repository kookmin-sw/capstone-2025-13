import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDFCEC",
    },
    scroll: {
        paddingBottom: 40,
    },
    chatbotContainer: {
        backgroundColor: "#EAFBF0",
        padding: 14,
        borderRadius: 16,
        marginVertical: 16,
        flexDirection: "row",
        alignItems: "flex-start",
      },
      chatbotText: {
        fontSize: 15,
        color: "#333",
        flex: 1,
        marginLeft: 10,
      },
      additionalInput: {
        backgroundColor: "#FFFDEB",
        borderRadius: 12,
        padding: 14,
        fontSize: 14,
        color: "#444",
        marginBottom: 24,
      },
      submitButton: {
        width: width * 0.2,
        backgroundColor: "#4CAF50",
        paddingVertical: 20,
        borderRadius: 30,
        alignItems: "center",
        marginHorizontal: 20,
      },
      submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
});

export default styles;