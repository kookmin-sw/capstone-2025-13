import { Platform, StyleSheet, Dimensions } from "react-native";
import colors from "../constants/colors";

const { width, height } = Dimensions.get("window"); // 화면 높이 가져오기

const helpCallStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    headerBox: {
        backgroundColor: "white",
        paddingHorizontal: 10,
        elevation: Platform.OS === "android" ? 10 : 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        width: "100%",
        height: height * 0.25, 
        justifyContent: "center",
        zIndex: 10,
        paddingTop: height * 0.07, 
    },
    backButtonWrapper: {
        position: 'absolute',
        left: width* 0.01,
        top: width* 0.115,
        padding: 8,
        zIndex: 10,
      },
    headerText: {
        fontWeight: "bold",
        fontSize: 22,
        textAlign: "center",
    },
    scrollContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 40,
        marginHorizontal: 5,
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
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    itemContainer: {
        padding: 16,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    itemPhone: {
        color: colors.red,
    },
    itemWebsite: {
        color: "blue",
        textDecorationLine: "underline",
    },
});

export default helpCallStyles;