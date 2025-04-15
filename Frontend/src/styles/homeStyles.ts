import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDFCEC",
    },
    scroll: {
        paddingBottom: 100,
    },
    headerWrapper: {
        position: "relative",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    circle: {
        position: "absolute",
        bottom: -40,
        zIndex: -1,
        width: width * 1.2,
        height: height * 0.5,
    },
    buttonGroup: {
        marginTop: 24,
        paddingHorizontal: 20,
        gap: 12,
    },
});

export default styles;
