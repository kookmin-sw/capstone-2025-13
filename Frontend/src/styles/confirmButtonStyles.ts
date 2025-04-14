import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    button: {
        marginTop: 32,
        marginHorizontal: width * 0.07,
        backgroundColor: "#3CB46E",
        borderRadius: 40,
        paddingVertical: 14,
        alignItems: "center",
    },
    label: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default styles;
