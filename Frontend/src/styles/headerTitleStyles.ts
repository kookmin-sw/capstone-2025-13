import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: width * 0.07,
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: "#3CB46E",
    },
    title: {
        fontSize: width * 0.07,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default styles;
