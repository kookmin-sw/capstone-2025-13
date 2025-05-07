import { Dimensions, StyleSheet } from "react-native";
import colors from "../constants/colors";

const { width, height } = Dimensions.get("window");

const dailyTopicstyles = StyleSheet.create({
    container: {
        backgroundColor: "#EEF7E8",
        flex: 1,
    },
    scrollContainer: {
        padding: width * 0.04,
        marginVertical: height * 0.03,
    },
    questionContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: height * 0.02,
    },
    answerContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: height * 0.02,
    },
    userProfileImage: {
        width: width * 0.1,
        height: width * 0.1,
        marginLeft: width * 0.03,
        marginTop: height * 0.015,
    },
    cloverProfileImage: {
        width: width * 0.1,
        height: width * 0.1,
        marginRight: width * 0.03,
        marginTop: height * 0.015,
    },
    contentContainer: {
        flexDirection: "column",
        flex: 1,
    },
    itemContainer: {
        marginBottom: height * 0.015,
    },
    inputContainer: {
        flexDirection: "row",
        padding: width * 0.03,
        backgroundColor: "#E1EDDA",
        gap: width * 0.025,
    },
    textInput: {
        height: height * 0.06,
        borderRadius: width * 0.1,
        paddingHorizontal: width * 0.03,
        backgroundColor: colors.white,
        flex: 1,
    },
    sendButton: {
        backgroundColor: "#258D55",
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.015,
        marginBottom: width * 0.05,
        borderRadius: width * 0.1,
        alignContent: "center",
        justifyContent: "center",
    },
    sendButtonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: width * 0.035,
    },
});

export default dailyTopicstyles;
