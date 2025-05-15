import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    shadowWrapper: {
        width: width * 0.9,
        height: height * 0.207,  
        marginBottom: 20,
        backgroundColor: "#E8ECD0", 
        borderRadius: 30,  
    },
    inputBox: {
        width: width * 0.9,
        height: height * 0.2,
        marginBottom: 20,
        backgroundColor: "#F9FAEC",
        borderRadius: 25,
        padding: 20,
        zIndex: 1,  // Make sure it appears on top of the shadow
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        textAlignVertical: "top",
    },
});

export default styles;
