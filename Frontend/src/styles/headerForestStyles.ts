import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
    wrapper: {
        position: "relative",
        zIndex: 1,
    },
    background: {
        width: "100%",
        height: 240,
        resizeMode: "cover",
        justifyContent: "flex-end",
    },
    container: {
        paddingHorizontal: 24,
        paddingBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
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
        overflow: "visible", // ✅ 추가
    },
});
