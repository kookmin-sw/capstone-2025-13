import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
    wrapper: {
        position: "relative",
        zIndex: 1,
    },
    background: {
        width: "100%",
        height: width * 0.5,
        justifyContent: "center",
        alignItems: "flex-start",
        marginTop: 16, // ✅ 이미지 위치를 조금 아래로 내림. 숫자를 조정해서 더 미세하게 제어 가능
    },
    container: {
        paddingHorizontal: 24,
        paddingBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: 12, // ✅ 텍스트 위치를 조금 아래로 내림
    },
    title: {
        fontSize: 40,
        color: "#fff",
        fontFamily: fonts.laundry,
        marginLeft: 18,
        marginTop: 10,
    },
    dateBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignItems: "center",
    },
    day: {
        fontSize: 12,
        color: "#F17300",
        fontWeight: "bold",
    },
    date: {
        fontSize: 18,
        color: "#F17300",
        fontWeight: "bold",
    },
    oval: {
        position: "absolute",
        bottom: -40,
        alignSelf: "center",
        width: width * 1.2,
        height: 120,
        backgroundColor: "#FDFCEC",
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        zIndex: -1,
    },
    headerWrapper: {
        position: "relative",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "visible",
    },
    circle: {
        position: "absolute",
        bottom: -40,
        alignSelf: "center",
        width: width * 1.2,
        height: 160,
        backgroundColor: "#FDFCEC",
        borderTopLeftRadius: width,
        borderTopRightRadius: width,
        zIndex: 2,
    },
});
