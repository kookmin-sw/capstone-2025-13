import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../constants/fonts";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    imageContainer: {
        flexDirection: "row", // 이미지 두 개를 가로로 배치
        justifyContent: "space-between", // 이미지 간의 간격을 조정
        width: "90%", // 부모의 너비에 맞춰 90% 크기로 설정
    },
    profileImage: {
        width: width * 0.15, // 카톡 프로필 이미지 크기
        height: width * 0.15, // 정사각형 크기로 만들기
        marginTop: width * 0.03,
        marginRight: width * 0.01, // 이미지 사이의 간격
    },
    inputImage: {
        width: width * 0.7, // 입력창 이미지 크기
        height: height * 0.2, // 높이를 동일하게 설정
        marginTop: width * 0.03,
        borderRadius: 12, // 둥근 테두리
    },
    overlayText: {
        fontSize: width * 0.03,
        letterSpacing: 0.5, // 글자 간격
        lineHeight: width * 0.045, // 줄 간격
        fontFamily: fonts.medium,
        color: "black", // 텍스트 색상
        textAlign: "left", // 텍스트 왼쪽 정렬
        zIndex: 10,
    },
    shadowWrapper: {
        width: width * 0.75,
        minHeight: height * 0.157,
        marginBottom: 20,
        backgroundColor: "#B2C9A6",
        borderRadius: 30,
    },
    inputBox: {
        flex: 1,
        // width: width * 0.75,
        // height: height * 0.15,
        marginBottom: 7,
        backgroundColor: "#EEF7E8",
        borderRadius: 25,
        padding: 20,
        zIndex: 1,
    },
});

export default styles;
