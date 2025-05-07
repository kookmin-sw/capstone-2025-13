import { StyleSheet } from "react-native";
import fonts from "../constants/fonts";

export const secondPasswordStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    title: {
        fontSize: 16,
        fontFamily: fonts.semiBold,
        marginVertical: 20,
    },
    passwordContainer: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 10,
    },
    clover: {
        width: 30,
        height: 30,
    },
    resetText: {
        color: '#999',
        fontSize: 12,
        marginBottom: 20,
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginHorizontal: 10,
        width: '100%',
        backgroundColor: "#1AA85C",
        padding: 20,
    },
    keyButton: {
        width: '30%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyText: {
        fontSize: 30,
        color: 'white',
        fontFamily: fonts.semiBold,
    },
    smallText: {
        fontSize: 16,
        color: 'white',
    },
});
