import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const questMeditationStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "#0e0033",
    },
    container: {
        alignItems: "center",
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.03,
    },
    timerText: {
        color: "#fff94f",
        fontFamily: fonts.laundryBold,
        fontSize: width * 0.1,
        textShadowColor: "#fff",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    youtubeWrapper: {
        width: width * 0.9,
        height: height * 0.25,
        borderRadius: 12,
        overflow: "hidden",
        marginVertical: height * 0.02,
    },
    backButtonWrapper: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
    },
    button: {
        borderRadius: 20,
        alignSelf: "center",
        position: "absolute",
        zIndex: 1,
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.05,
    },
    buttonText: {
        color: "#fff",
        fontFamily: fonts.laundryBold,
        fontSize: width * 0.04,
    },
    missionTitle: {
        marginLeft: width * 0.04,
        fontFamily: fonts.laundryBold,
        color: "#fff",
        fontSize: width * 0.06,
        alignSelf: "flex-start", // 왼쪽 정렬
    },
    mainText: {
        marginLeft: width * 0.04,
        fontFamily: fonts.laundryBold,
        color: "#fff",
        fontSize: width * 0.045,
        alignSelf: "flex-start", // 왼쪽 정렬
    },
    timerWrapper: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    timerDescription: {
        position: "absolute",
        right: width * 0.001,
        top: height * 0.01,
    },
    warningTitle: {
        color: "#fff",
        fontFamily: fonts.laundry,
        fontSize: width * 0.04,
    },
    description: {
        color: "#ccc",
        fontFamily: fonts.laundry,
        textAlign: "center",
        fontSize: width * 0.03,
        marginVertical: height * 0.005,
        lineHeight: width * 0.045,
    },
    sectionTitle: {
        fontFamily: fonts.laundryBold,
        color: "#fff94f",
        alignSelf: "flex-start", // 왼쪽 정렬
        fontSize: width * 0.05,
        marginTop: height * 0.025,
        marginBottom: height * 0.01,
    },
    videoCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a40",
        borderRadius: 12,
        width: "100%",
        padding: width * 0.03,
        marginBottom: height * 0.015,
    },
    thumbnail: {
        width: width * 0.25,
        height: width * 0.18,
        borderRadius: 8,
        marginRight: width * 0.03,
    },
    videoTextWrapper: {
        flexShrink: 1,
    },
    videoTitle: {
        color: "#fff",
        fontFamily: fonts.laundryBold,
        marginBottom: 2,
        fontSize: width * 0.04,
    },
    videoMeta: {
        color: "#ccc",
        fontFamily: fonts.laundry,
        fontSize: width * 0.03,
    },
    modalContent: {
        maxWidth: "90%",
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 24,
        position: "absolute",
        top: "30%", // 화면 위쪽에서 30% 위치
    },
});

export default questMeditationStyles;
