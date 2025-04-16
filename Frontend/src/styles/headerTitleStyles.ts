import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: width * 0.07,
        paddingTop: 80,
        paddingBottom: 20,
        backgroundColor: "#3CB46E",
    },
    title: {
        fontSize: width * 0.07,
        fontWeight: "bold",
        color: "#fff",
        fontFamily: fonts.laundry,
    },
});

export default styles;
