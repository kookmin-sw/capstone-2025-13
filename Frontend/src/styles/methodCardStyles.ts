// styles/methodCardStyles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: width * 0.07,
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    iconBox: {
        width: 30,
        height: 30,
        backgroundColor: "#E1E1E1",
        borderRadius: 6,
        marginRight: 16,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
    },
});

export default styles;
