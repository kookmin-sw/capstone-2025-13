import { StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

const signInStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(0,0,0,0.5)",
    },
    container: {
        backgroundColor: colors.background,
        borderRadius: 10,
        padding: 20,
        width: "80%",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.bold,
        marginBottom: 10,
        textAlign: "left",
        color: colors.brown,
    },
    inputTitle: {
        fontSize: 15
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 45,
        width: "100%",
        padding: 8,
        marginTop: 5,
        backgroundColor: colors.white,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    row: {
        flexDirection: "row",
        marginTop: 20,
        alignContent: "center",
        justifyContent: "space-between",
    },
    backButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.lightBrown,
        borderRadius: 5,
        width: "45%",
        height: 45,
        alignItems: "center", 
        justifyContent: "center",
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 4,
        elevation: 5, 
    },
    backText: {
        color: colors.white,
        fontFamily: fonts.bold,
    },
    signInButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.lightGreen,
        borderRadius: 5,
        width: "45%",
        height: 45,
        alignItems: "center", 
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    signInText: {
        color: colors.white,
        fontFamily: fonts.bold,
    },
});

export default signInStyles;