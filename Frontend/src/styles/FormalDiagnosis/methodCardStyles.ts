// styles/methodCardStyles.ts
import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../constants/fonts";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        height: 70,
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: width * 0.07,
        padding: 16,
        borderRadius: 14,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
iconBox: {
        width: 25,
        height: 25,
        borderRadius: 6,
        marginRight: 16,
        marginLeft: 10,
        justifyContent: "center",  // 추가
        alignItems: "center",      // 추가
    },
    iconText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
        fontFamily: fonts.semiBold,
        textAlign:"center"
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
        fontFamily: fonts.semiBold,
    },
});

export default styles;
