import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    modalContainer: {
        width: width * 0.8,
        maxWidth: 360,
        minHeight: height * 0.2,
        backgroundColor: "#F9FAEC",
        paddingVertical: height * 0.03,
        paddingHorizontal: width * 0.05,
        borderRadius: 20,
        alignItems: "center",
        zIndex: 10000,
    },

    modalText: {
        fontSize: width * 0.045,
        fontFamily: fonts.extraBold,
        marginBottom: height * 0.01,
        color: "#333333",
        textAlign: "center",
    },

    modalSubText: {
        fontSize: width * 0.035,
        fontFamily: fonts.primary,
        color: "#666666",
        letterSpacing: 0.5,
        lineHeight: height * 0.025,
        textAlign: "center",
        marginBottom: height * 0.03,
    },

    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-evenly",

        width: "100%",
    },

    modalButton: {
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.05,
        borderRadius: 8,
        fontFamily: fonts.medium,
    },

    closeButton: {
        backgroundColor: "#C8B6A1",
    },

    diaryButton: {
        backgroundColor: "#1BA663",
    },

    modalButtonText: {
        color: "white",
        fontSize: width * 0.04,
        textAlign: "center",
        fontFamily: fonts.laundry,
        letterSpacing: 0.5,
    },
});

export default styles;
