import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts.ts";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        marginTop: height * 0,
        marginHorizontal: width * 0.06,
        justifyContent: "center",
        alignItems: "center", // 중앙 정렬 추가
    },
    imageBackground: {
        justifyContent: "center",
        marginLeft: width * 0.04,
        width: "95%",
        height: height * 0.25,
        paddingVertical: height * 0.02,
        borderRadius: 16,
        overflow: "hidden",
    },
    input: {
        minHeight: height * 0.17,
        fontSize: width * 0.035,
        textAlignVertical: "top",
        paddingVertical: 0.005,
        marginLeft: width * 0.07,
        letterSpacing: 0.7,
        color: "#d9d9d9",
        fontFamily: fonts.medium,
        width: "100%",
    },
    button: {
        backgroundColor: "#F6914D",
        width: width * 0.3,
        borderRadius: 20,
        paddingVertical: height * 0.015,
        position: "absolute", // 절대 위치 지정
        bottom: height * 0.03, // 화면 하단에서의 간격 조정
        right: width * 0.1, // 화면 오른쪽에서의 간격 조정
        justifyContent: "center", // 버튼 텍스트 중앙 정렬
        alignItems: "center",
        shadowColor: "#C26E35",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 10,
        shadowRadius: 0,
        elevation: 4,
    },
    buttontext: {
        color: "#fff",
        fontSize: 14,
        letterSpacing: 1,
        fontFamily: fonts.laundryBold,
    },
    cloverIcon: {
        marginRight: 12,
        marginBottom: 2,
    },
});

export default styles;
