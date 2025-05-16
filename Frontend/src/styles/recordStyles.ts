import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDFCEC",
        paddingHorizontal: 10,
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
        width: width * 0.5, // 버튼 너비를 더 넓게 설정
        height: height * 0.1, // 버튼 높이를 더 크게 설정
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 20,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: fonts.laundryBold,
    },
    shadowWrapper: {
        width: width * 0.3,
        height: height * 0.02,
        marginBottom: 20,
        backgroundColor: "#0A814C",
        borderRadius: 40,
    },
    inputBox: {
        width: width * 0.3,
        height: height * 0.01,
        marginBottom: 20,
        backgroundColor: "#1AA85C",
        borderRadius: 40,
        padding: 20,
        zIndex: 1,
    },
    // recordStyles.ts에 추가

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#FDFCEC",
        borderRadius: 16,
        padding: 24,
        width: "80%",
        alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    modalButtonGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: "#4FA55C",
        padding: 12,
        borderRadius: 40,
    },
    modalButtonText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontfamily: fonts.laundry,
    },
    saveButton: {
        width: width * 0.25,
        height: height * 0.06,
        backgroundColor: "#1AA85C",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#0A814C",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 10,
        shadowRadius: 0,
        elevation: 5,
    },
});

export default styles;
