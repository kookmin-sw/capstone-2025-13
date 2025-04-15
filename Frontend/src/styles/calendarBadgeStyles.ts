import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";

export default StyleSheet.create({
    dateBox: {
        backgroundColor: "#F6914D",
        width: 54,
        height: 65,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#fff",
        borderWidth: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    day: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
    },
    date: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold",
    },
});
