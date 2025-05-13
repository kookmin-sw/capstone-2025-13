import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute", // 화면 전체에 걸쳐서 모달을 표시
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999, // zIndex 더 높게 설정
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경에 반투명 처리 추가
    },

    modalContainer: {
        width: "80%",
        maxWidth: 350,
        backgroundColor: "#F9FAEC",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        zIndex: 10000, // modal 자체에도 zIndex를 추가해서 다른 컴포넌트들보다 위에 표시되도록
    },

    modalText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalSubText: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    closeButton: {
        backgroundColor: "#C8B6A1",
    },
    diaryButton: {
        backgroundColor: "#1BA663",
    },
    modalButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default styles;