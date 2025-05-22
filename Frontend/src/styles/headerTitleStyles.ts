import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection:'row',
        paddingHorizontal: width * 0.07,
        paddingTop: 60,
        paddingBottom: 10,
        backgroundColor: "#3CB46E",
        alignItems:'center'
    },
    backButtonWrapper: {
        marginRight: width * 0.02,
        zIndex:999,
      },
    title: {
        fontSize: width * 0.07,
        color: "#fff",
        fontFamily: fonts.laundryBold,
    },
});

export default styles;
