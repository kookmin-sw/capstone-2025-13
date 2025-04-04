import { StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

const dialogueChoiceStyles = StyleSheet.create({
    dialogueBox: {
        width: "100%",
        height: "15%",
        marginVertical: 20,
    },
    dialogueTextBox: {
        position: "relative",
        padding: 50,
        width: "100%",
        height: "100%",
        backgroundColor: colors.background,
        borderRadius: 20

    },
    dialogueText: {
        fontSize: 16,
        color: "black",
        fontFamily: fonts.dialogue,
    },
    button: {
        alignContent: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 40,
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