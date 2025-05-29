import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const questStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#17B96D",
    },
    scrollContainer: {
        width: "100%",
        paddingBottom: height * 0.2,
    },
    headerWrapper: {
        position: "relative",
        width: "100%",
        height: height * 0.2,
        zIndex: 1,
    },
    circle: {
        position: "absolute",
        width: width,
        top: height * 0.195,
        alignSelf: "center",
        zIndex: 2,
    },
    elementsOverlay: {
        width: "100%",
    },
    elementWrapper: {
        width: width * 0.4,
        marginVertical: height * 0.002,
        zIndex: 4,
    },
    street: {
        position: "absolute",
        width: width * 0.66,
        height: width * 0.4,
        alignSelf: "center",
        zIndex: 3,
    },
    clover: {
        position: "absolute",
        top: height * 0.5,
        right: width * 0.05,
        width: width * 0.3,
        height: width * 0.3,
        zIndex: 10,
    },
    infoIcon: {
        position: "absolute",
        left: 130,
        top: 10,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-start",
        alignItems: "center",
    },

    modalContent: {
        maxWidth: "90%",
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 24,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
        position: "absolute",
        top: "24%", // 화면 위쪽에서 30% 위치
        left: "6%",
    },

    modalArrow: {
        position: "absolute",
        top: -16,
        left: "44%",
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 16,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#fff",
        transform: [{ translateX: 12 }],
    },

    modalTitle: {
        fontSize: 16,
        letterSpacing: 0.8,
        color: "#333",
        fontFamily: fonts.laundryBold,
        marginBottom: 12,
        paddingHorizontal: 8,
        padding: 16,
    },

    modalText: {
        fontSize: 13,
        color: "#333",
        letterSpacing: 0.6,
        lineHeight: 20,
        fontFamily: fonts.laundry,
        paddingHorizontal: 8,
    },

    closeButton: {
        marginTop: 20,
        alignSelf: "flex-end",
        marginRight: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#F6914D",
        borderRadius: 10,
    },

    closeButtonText: {
        color: "#fff",
        fontSize: 12,
        letterSpacing: 0.8,
        fontFamily: fonts.laundry,
        textAlign: "center",
    },
});

export default questStyles;
