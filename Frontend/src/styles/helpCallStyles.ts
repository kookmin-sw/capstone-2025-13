import { Platform, StyleSheet, Dimensions } from "react-native";
import colors from "../constants/colors";

const { width, height } = Dimensions.get("window");

const helpCallStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    headerBox: {
        backgroundColor: "white",
        paddingHorizontal: width * 0.015,
        elevation: Platform.OS === "android" ? 10 : 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: height * 0.006 },
        shadowOpacity: 0.5,
        shadowRadius: width * 0.03,
        width: "100%",
        height: height * 0.2,
        justifyContent: "center",
        zIndex: 10,
        paddingTop: height * 0.07,
    },
    backButtonWrapper: {
        position: 'absolute',
        left: width * 0.02,
        top: width * 0.115,
        padding: width * 0.02,
        zIndex: 11,
    },
    headerText: {
        fontWeight: "bold",
        fontSize: width * 0.055,
        textAlign: "center",
    },
    scrollContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: height * 0.015,
    },
    button: {
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.045,
        borderRadius: width * 0.1,
        marginHorizontal: width * 0.015,
        borderWidth: 1,
    },
    selectedButton: {
        backgroundColor: colors.green,
        borderColor: colors.green,
    },
    unselectedButton: {
        backgroundColor: "white",
        borderColor: colors.darkGrey,
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: width * 0.03,
        textAlign: "center",
    },
    selectedText: {
        color: "white",
    },
    unselectedText: {
        color: colors.darkGrey,
    },
    callButton: {
        position: "absolute",
        bottom: height * 0.025,
        right: width * 0.05,
        width: width * 0.15,
        height: width * 0.15,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    itemContainer: {
        padding: width * 0.04,
    },
    itemTitle: {
        fontSize: width * 0.04,
        fontWeight: "600",
    },
    itemPhone: {
        fontSize: width * 0.038,
        color: colors.red,
    },
    itemWebsite: {
        fontSize: width * 0.038,
        color: "blue",
        textDecorationLine: "underline",
    },
});

export default helpCallStyles;
