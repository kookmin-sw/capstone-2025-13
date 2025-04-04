import { StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

const dialogueBoxStyles = StyleSheet.create({
    dialogueBox: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "30%"
    },
    nametag: {
        position: "absolute",
        top: -20,
        left: 30,
        zIndex: 10,
        width: 100,
        height: 40,
        borderRadius: 10,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: colors.grey,
    },
    nametagText: {
        fontSize: 16,
        color: "black",
        textAlign: "center",
        fontFamily: fonts.semiBold,
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


export default dialogueBoxStyles;