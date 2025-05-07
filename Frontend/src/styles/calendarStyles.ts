import { StyleSheet, Dimensions } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const calendarStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.08,
        backgroundColor: "#4CAF50"
    },
    backButtonWrapper: {
        marginRight: width * 0.02,
      },
    header: {
        paddingVertical: height * 0.03,
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: width * 0.075, // 약 30
        fontWeight: "bold",
        color: "#fff",
        fontFamily: fonts.laundryBold,
    },
    calendar: {
        borderRadius: width * 0.05,
        overflow: 'hidden',
    },
    attendanceBar: {
        marginTop: height * 0.02,
        alignItems: 'center',
    },
    attendanceText: {
        fontSize: width * 0.035,
        color: colors.white,
    },
    count: {
        fontWeight: 'bold',
        fontSize: width * 0.05,
        color: colors.white,
    },
    taskList: {
        marginTop: height * 0.02,
        backgroundColor: '#F2F3E5',
        borderRadius: width * 0.1,
        padding: width * 0.07,
    },
    dateTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginBottom: height * 0.012,
        color: "#714E25"
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width * 0.025,
    },
    dot: {
        width: width * 0.02,
        height: width * 0.02,
        backgroundColor: '#89673F',
        borderRadius: width * 0.01,
        marginTop: height * 0.007,
        marginRight: width * 0.025,
    },
    taskTitle: {
        fontSize: width * 0.04,
        fontWeight: '500',
        color: "#89673F"
    },
    taskSubtitle: {
        fontSize: width * 0.033,
        color: '#89673F',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2D2BF',
        width: '100%',
        marginVertical: height * 0.005,
    },
});

export default calendarStyles;
