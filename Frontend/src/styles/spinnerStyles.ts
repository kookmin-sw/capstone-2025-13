import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const leafSize = width * 0.1;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2FBE0",
        justifyContent: "center",
        alignItems: "center",
    },
    cloverContainer: {
        width: width * 0.5,
        height: width * 0.5,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        marginTop: -80,
    },
    leaf: {
        position: "absolute",
        width: leafSize,
        height: leafSize,
    },
    loadingText: {
        marginTop: -40,
        fontSize: 18,
        color: "#4CAF50",
        fontFamily: "DungGeunMo",
    },
});
