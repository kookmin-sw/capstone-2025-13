import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        marginTop: height * 0.02,
        marginHorizontal: width * 0.06,
        justifyContent: "center",
        alignItems: "center", // 중앙 정렬 추가
    },
    imageBackground: {
        width: "100%",
        height: height * 0.2,
        paddingVertical: height * 0.01,
        justifyContent: "center", // 내용물 수직 중앙 정렬
        alignItems: "center", // 내용물 수평 중앙 정렬
        borderRadius: 16,
        overflow: "hidden",
    },
    input: {
        minHeight: height * 0.15,
        fontSize: width * 0.035,
        textAlignVertical: "top",
        paddingVertical: height * 0.01,
        paddingHorizontal: height * 0.02,
        color: "#000",
        width: "100%", // 입력란이 부모 크기에 맞게 확장되도록 설정
    },
    button: {
        backgroundColor: "#F6914D",
        width: width * 0.3,
        borderRadius: 16,
        paddingVertical: 16,
        position: "absolute", // 절대 위치 지정
        bottom: height * 0.02, // 화면 하단에서의 간격 조정
        right: width * 0.06, // 화면 오른쪽에서의 간격 조정
        justifyContent: "center", // 버튼 텍스트 중앙 정렬
        alignItems: "center", // 버튼 텍스트 중앙 정렬
    },
    buttontext: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default styles;
