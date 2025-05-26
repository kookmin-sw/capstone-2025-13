import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../constants/fonts";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        marginTop: 0,
        marginHorizontal: width * 0.06,
        justifyContent: "center",
        alignItems: "center",
    },
    imageBackground: {
        justifyContent: "center",
        marginLeft: width * 0.04,
        width: "95%",
        height: height * 0.25,
        paddingVertical: height * 0.02,
        borderRadius: 16,
        overflow: "hidden",
    },
    input: {
        minHeight: height * 0.17,
        fontSize: width * 0.035,
        textAlignVertical: "top",
        paddingVertical: height * 0.01, 
        marginLeft: width * 0.07,
        letterSpacing: 0.7,
        color: "#000",
        fontFamily: fonts.medium,
        width: "100%",
    },
    button: {
        backgroundColor: "#F6914D",
        width: width * 0.3,
        borderRadius: 20,
        paddingVertical: height * 0.015,
        position: "absolute",
        bottom: height * 0.03,
        right: width * 0.1,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#C26E35",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4, // 10 → 0.4로 수정
        shadowRadius: 4,
        elevation: 4,
    },
    buttontext: {
        color: "#fff",
        fontSize: 14,
        letterSpacing: 1,
        fontFamily: fonts.laundryBold,
    },
    cloverIcon: {
        // marginRight: 8,
        marginBottom: 2,
    },
});

export default styles;
