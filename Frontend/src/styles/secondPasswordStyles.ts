import { Dimensions, StyleSheet } from "react-native";
import fonts from "../constants/fonts";

const { width,  height} = Dimensions.get("window");


export const secondPasswordStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    header: {
        marginTop: height * 0.03, 
        width: "100%",
    paddingHorizontal: width * 0.05,
    flexDirection: "row",            // 수평 정렬로 전환
    alignItems: "center",            // 수직 중앙 정렬
    justifyContent: "flex-start",  
    },
backButtonWrapper: {
    marginRight: width * 0.02,
    zIndex: 999,
    marginLeft: 0,                    // 혹시 불필요한 여백이 있으면 제거
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
        color: '#000000',
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
