import { StyleSheet } from "react-native";
import fonts from "../constants/fonts";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F0F0D9",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 20,
        elevation: 2,
    },
    levelWrapper: {
        position: "absolute",
        top: 8,
        left: 12,
    },
    levelText: {
        fontSize: 35,
        fontFamily: fonts.laundryBold,
        marginTop: 15,
        marginLeft: 20,
        color: "#795548",
    },
    potImage: {
        height: 80,
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: 40,
        marginBottom: 12,
    },
    progressWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        marginBottom: 8,
        marginHorizontal: 16,
    },
    progressButtonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginTop: 6,
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 15,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: "#81D4FA",
        borderRadius: 4,
    },
    progressText: {
        marginLeft: 8,
        fontSize: 12,
        color: "#333",
    },
    button: {
        backgroundColor: "#4FC3F7",
        paddingVertical: 11,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: "flex-end",
        shadowColor: "#3186AD",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 10,
        shadowRadius: 0,
        elevation: 4,
    },
    buttonText: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: "#fff",
        fontFamily: fonts.laundryBold,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    waterIcon: {
        marginRight: 2,
        marginBottom: 0.5, // adjust vertical alignment slightly
    },
});

export default styles;
