// styles/surveyHeaderStyles.ts
import { StyleSheet } from "react-native";
import fonts from "../../constants/fonts";

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#3CB46E",
        paddingTop: 60,
        paddingBottom: 25,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 26,
        fontFamily: fonts.laundryBold,
        color: "white",
        marginTop: 20,
    },
});

export default styles;
