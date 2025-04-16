import { StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0A814C",
    },
    scroll: {
        paddingTop: height * 0.08,
        paddingBottom: 100,
    },
    headerWrapper: {
        position: "relative",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    circle: {
        position: "absolute",
        top: height * 0.2,
        alignSelf: "center",
        zIndex: 0,
    },
    buttonGroup: {
        marginTop: 28,
        paddingHorizontal: 20,
        gap: 20,
    },
    calendarBadgeWrapper: {
        position: "absolute",
        top: 100,
        right: 20,
        zIndex: 3,
    },
    dateBox: {
        backgroundColor: "#F6914D",
        width: 56,
        height: 80,
        borderRadius: 12,
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
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
    },
    date: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "bold",
    },
});

export default styles;
