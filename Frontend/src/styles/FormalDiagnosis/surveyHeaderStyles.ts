// styles/surveyHeaderStyles.ts
import { Dimensions, StyleSheet } from "react-native";
import fonts from "../../constants/fonts";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    header: {
        flexDirection:'row',
        paddingHorizontal: width * 0.07,
        paddingTop: 60,
        paddingBottom: 10,
        backgroundColor: "#3CB46E",
        alignItems:'center'
    },
    title: {
        fontSize: width * 0.07,
        color: "#fff",
        fontFamily: fonts.laundryBold,
    },
    backButtonWrapper: {
    marginRight: width * 0.02,
    zIndex:999,
      },
});

export default styles;
