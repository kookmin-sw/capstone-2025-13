import { Dimensions, StyleSheet } from "react-native";
import colors from "../constants/colors";
const { width, height } = Dimensions.get("window");

const dailyTopicstyles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:"#EEF7E8",
    },
    scrollContainer: {
        padding: 16,
        marginVertical: height * 0.03,
    },
    questionContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    answerContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 16,
    },
    userProfileImage: {
        width: 40,
        height: 40,
        marginLeft: 12,
        marginTop: 5,
    },
    cloverProfileImage: {
        width: 40,
        height: 40,
        marginRight: 12,
        marginTop: 12,
    },
    contentContainer: {
        flexDirection: "column",
        flex: 1,
    },
    itemContainer: {
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: "row",
        padding: 12,
        backgroundColor: "#E1EDDA",
        gap: 10,
        
    },
    textInput: {
        height: 45,
        borderRadius: 40,
        paddingHorizontal: 12,
        backgroundColor: colors.white,
        flex: 1
    },    
    sendButton: {
        backgroundColor: "#258D55",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 40,
        alignContent: "center",
        justifyContent: "center",
    },
    sendButtonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default dailyTopicstyles;
