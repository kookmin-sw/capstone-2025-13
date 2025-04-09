import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useCustomFonts } from "../hooks/useCustomFonts";
import colors from "../constants/colors";
import fonts from "../constants/fonts";


const DialogueQuestionBox = () => {
    const fontsLoaded = useCustomFonts();
    // if (!fontsLoaded) {
    //     return (
    //         <View>
    //             <Text>로딩 중...</Text>
    //         </View>
    //     );
    // }


    return (
        <View style={style.dialogueBox}>
            <View style={style.nametag}>
                <Text style={style.nametagText}>질문</Text>
            </View>
            <View style={style.dialogueTextBox}>
                <Text style={style.dialogueText}>
                    자려고 누웠다. {"\n"}지금 드는 생각은?
                </Text>

            </View>
        </View>

    );
};

const style = StyleSheet.create({
    dialogueBox: {
        position: "absolute",
        top: "30%",
        alignSelf: "center",
        justifyContent: "center",
        width: "90%",
        height: "20%",
    },
    nametag: {
        position: "absolute",
        top: -20,
        left: 30,
        zIndex: 10,
        width: 100,
        height: 40,
        borderRadius: 10,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: colors.grey,
    },
    nametagText: {
        fontSize: 16,
        color: "black",
        textAlign: "center",
        fontFamily: fonts.semiBold,
    },
    dialogueTextBox: {
        position: "relative",
        padding: 50,
        width: "100%",
        height: "100%",
        backgroundColor: colors.background,
        borderRadius: 20

    },
    dialogueText: {
        fontSize: 20,
        color: "black",
        fontFamily: fonts.dialogue,
        textAlign: "center",
    },
    button: {
        alignContent: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 40,
        right: 20,
        zIndex: 10,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 15,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: colors.grey,
    },
});

export default DialogueQuestionBox;
