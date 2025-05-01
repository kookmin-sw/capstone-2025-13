import { StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0A814C",
    },
    scroll: {
        paddingTop: hp(8),
    },
    headerWrapper: {
        position: "relative",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    circle: {
        position: "absolute",
        top: hp(20),
        alignSelf: "center",
        zIndex: 0,
    },
    buttonGroup: {
        marginTop: hp(3.5),
        paddingHorizontal: wp(5),
        gap: hp(2),
    },
    calendarBadgeWrapper: {
        position: "absolute",
        top: hp(12),
        right: wp(5),
        zIndex: 3,
    },
    dateBox: {
        backgroundColor: "#F6914D",
        width: wp(15),
        height: hp(10),
        borderRadius: wp(3),
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#fff",
        borderWidth: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    day: {
        fontSize: wp(3.7),
        color: "#fff",
        fontWeight: "bold",
    },
    date: {
        fontSize: wp(5.8),
        color: "#fff",
        fontWeight: "bold",
    },
    floatingButtonWrapper: {
        marginTop: hp(15),
        marginBottom: hp(5),
        alignItems: "flex-end",
        paddingRight: wp(6),
    },
});

export default styles;
