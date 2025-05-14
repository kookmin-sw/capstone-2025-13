import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDFCEC",
    },
    scroll: {
        paddingBottom: 40,
    },
    chatbotContainer: {
        backgroundColor: "#EAFBF0",
        padding: 14,
        borderRadius: 16,
        marginVertical: 16,
        flexDirection: "row",
        alignItems: "flex-start",
      },
      chatbotText: {
        fontSize: 15,
        color: "#333",
        flex: 1,
        marginLeft: 10,
      },
      additionalInput: {
        backgroundColor: "#FFFDEB",
        borderRadius: 12,
        padding: 14,
        fontSize: 14,
        color: "#444",
        marginBottom: 24,
      },
      submitButton: {
          width: width * 0.5,  // 버튼 너비를 더 넓게 설정
          height: height * 0.1,  // 버튼 높이를 더 크게 설정
          paddingVertical: 20,
          alignItems: "center",
          justifyContent: "center", // 버튼의 내용을 가운데로 배치
          marginHorizontal: 20,
      },
      submitButtonImg: {
          width: width * 0.4,  // 이미지 너비를 더 크게 설정
          height: height * 0.07,  // 이미지 높이를 더 크게 설정
          resizeMode: 'contain',  // 비율을 유지하면서 이미지 크기 맞추기
      },

      submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
      shadowWrapper: {
        width: width * 0.3,
        height: height * 0.02,  
        marginBottom: 20,
        backgroundColor: "#0A814C", 
        borderRadius: 40,  
    },
    inputBox: {
        width: width * 0.3,
        height: height * 0.01,
        marginBottom: 20,
        backgroundColor: "#1AA85C",
        borderRadius: 40,
        padding: 20,
        zIndex: 1,  
    },
});

export default styles;
