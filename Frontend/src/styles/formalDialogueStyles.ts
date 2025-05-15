import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDFCEC",
    },
    scroll: {
        paddingBottom: 40,
        paddingTop: 5,
    },
    sectionLabelText: {
        fontSize: 20,
        fontFamily: fonts.bold,
        color: "#444",
        marginBottom: 60,
        paddingHorizontal: 24,
    },
    chartSubtitle: {
        fontSize: 16,
        fontFamily: fonts.laundryBold,
        color: "#fff",
        paddingHorizontal: 24,
        marginTop: 10,
    },
});

export default styles;
