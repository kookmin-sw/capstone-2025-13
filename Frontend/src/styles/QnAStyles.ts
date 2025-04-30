import { StyleSheet } from "react-native";
import colors from "../constants/colors";

const questionStyle = StyleSheet.create({
    wrapper: {
        alignItems: "flex-start",
        marginVertical: 4,
    },
    container: {
        maxWidth: "83%",
        backgroundColor: colors.white,
        padding: 15,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
        borderBottomLeftRadius: 18,

    },
    questionText: {
    },
})

const answerStyle = StyleSheet.create({
    wrapper: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
        marginVertical: 4,

    },
    container: {
        maxWidth: "83%",
        padding: 15,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 18,
        borderBottomLeftRadius: 18,
        backgroundColor: colors.green,
    },
    answerText: {
        color: colors.white,
    },
})
export { questionStyle, answerStyle };