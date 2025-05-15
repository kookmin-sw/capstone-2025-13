import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 40,
        left: 30,
        right: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    bubble: {
        width: 60,
        height: 60,
        borderRadius: 28,
        backgroundColor: "#3FA057",
        justifyContent: "center",
        alignItems: "center",
    },
    badge: {
        position: "absolute",
        top: 1,
        right: 1,
        width: 15,
        height: 15,
        borderRadius: 15,
        backgroundColor: "#E8270A",
      },
});
