import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    imageBackground: {
        width: width * 0.9,
        height: height * 0.2,
        justifyContent: "center", 
    },
    textInput: {
        width: "90%", 
        padding: 30,
        fontSize: 16,
        borderRadius: 8,
    },
});

export default styles;
