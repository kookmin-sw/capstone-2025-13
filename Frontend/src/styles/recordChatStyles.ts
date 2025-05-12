import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    imageContainer: {
        flexDirection: "row", // 이미지 두 개를 가로로 배치
        justifyContent: "space-between", // 이미지 간의 간격을 조정
        width: "90%", // 부모의 너비에 맞춰 90% 크기로 설정
    },
    profileImage: {
        width: width * 0.15, // 카톡 프로필 이미지 크기
        height: width * 0.15, // 정사각형 크기로 만들기
        borderRadius: width * 0.1, // 반지름을 절반으로 하여 둥글게 만들기
        marginTop: width * 0.03, 
        marginRight: width * 0.01, // 이미지 사이의 간격
    },
    imageWrapper: {
        position: "relative", // 텍스트를 절대적으로 배치할 수 있도록 설정
    },
    inputImage: {
        width: width * 0.7, // 입력창 이미지 크기
        height: height * 0.2, // 높이를 동일하게 설정
        marginTop: width * 0.03, 
        borderRadius: 12, // 둥근 테두리
    },
    overlayText: {
        position: "absolute", // 텍스트를 이미지 위에 배치
        top: width * 0.1, // 이미지의 상단에서 10px 위치
        left: width * 0.05, // 이미지의 좌측에서 10px 위치
        fontSize: width * 0.035,
        fontFamily: fonts.medium,
        color: "black", // 텍스트 색상
        textAlign: "left", // 텍스트 왼쪽 정렬
        zIndex: 10,
    },
});

export default styles;
