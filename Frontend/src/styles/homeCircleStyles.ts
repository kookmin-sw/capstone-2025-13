import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
    circle: {
        position: "absolute",
        bottom: -40, // 헤더 아래서 겹쳐 올라오게
        alignSelf: "center",
        width: width * 1.2,
        height: 160,
        backgroundColor: "#FDFCEC", // 또는 #fff
        borderTopLeftRadius: width,
        borderTopRightRadius: width,
        zIndex: -1,
    },
});
