import { StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

const dialogueChoiceStyles = StyleSheet.create({
    container: {
        width: "100%",
        position: "absolute",
        bottom: 0,
        paddingBottom: 30,
        alignItems: "center",
    },
    dialogueBox: {
        width: "90%",
        marginVertical: 10,
    },
    dialogueTextBox: {
        justifyContent: "center",
        padding: 20,
        backgroundColor: colors.background,
        borderRadius: 20,
    },
    dialogueText: {
        fontSize: 16,
        color: "black",
        fontFamily: fonts.dialogue,
        textAlign: "center",
    },
    button: {
        position: "absolute",
        bottom: 20,
        right: 20,
        zIndex: 10,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 15,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: colors.grey,
    },
});


export default dialogueChoiceStyles;