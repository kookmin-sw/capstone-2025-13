import { Dimensions, StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const dailyTopicstyles = StyleSheet.create({
    container: {
        backgroundColor: "#EEF7E8",
        flex: 1,
    },
    backButtonWrapper: {
        position: 'absolute',
        left: width * 0.02,
        top: width * 0.115,
        padding: width * 0.02,
        zIndex: 11,
    },
    headerText: {
        fontFamily: fonts.semiBold,
        top: width * 0.15,
        marginBottom: width * 0.2,  
        fontSize: width * 0.055,
        textAlign: "center",
        color: "#349C64",
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
        borderRadius: (width * 0.1) / 2,
        marginTop: height * 0.005,
    },
    cloverProfileImage: {
        width: width * 0.1,
        height: width * 0.1,
        marginRight: width * 0.03,
        marginTop: height * 0.015,
        borderRadius: (width * 0.1) / 2,
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
        fontFamily: fonts.primary,
        flex: 1,
    },
    sendButton: {
        backgroundColor: "#258D55",
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.015,
        borderRadius: width * 0.1,
        alignContent: "center",
        justifyContent: "center",
    },
    sendButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: width * 0.035,
        fontFamily: fonts.semiBold,
    },
});

export default dailyTopicstyles;