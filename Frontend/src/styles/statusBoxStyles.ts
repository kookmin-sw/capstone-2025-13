import { StyleSheet } from "react-native";
import fonts from "../constants/fonts";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FDF6E4",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 20,
        elevation: 2,
    },
    levelWrapper: {
        position: "absolute",
        top: 8,
        left: 12,
    },
    levelText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#795548",
    },
    potImage: {
        width: 80,
        height: 80,
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 12,
    },
    progressWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        marginBottom: 8,
        marginHorizontal: 16,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: "#81D4FA",
        borderRadius: 4,
    },
    progressText: {
        marginLeft: 8,
        fontSize: 12,
        color: "#333",
    },
    button: {
        backgroundColor: "#4FC3F7",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: "flex-end",
        // ✅ 그림자 스타일 추가
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4, // Android 그림자
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontFamily: fonts.laundryBold,
    },
});

export default styles;
