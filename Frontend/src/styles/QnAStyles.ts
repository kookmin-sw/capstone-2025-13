import { StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

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
        flexDirection: 'row',

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
    number: {
        fontSize: 10,  // 원하는 크기로 조정
        fontFamily:fonts.primary, // 숫자의 굵기를 설정
        marginRight: 4, // 숫자와 답변 텍스트 사이에 공간을 추가
    },
    answerText: {
        color: colors.white,
    },
})
export { questionStyle, answerStyle };