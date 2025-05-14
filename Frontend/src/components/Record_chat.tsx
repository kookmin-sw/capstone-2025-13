import React from "react";
import { View, Image, Text, } from "react-native";
import styles from "../styles/recordChatStyles";

interface RecordChatProps {
    luckyVicky: string,
    isLoading: boolean,
}

export default function RecordChat({ luckyVicky, isLoading }: RecordChatProps) {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require("../assets/Images/clover_profile.png")}
                    style={styles.profileImage}
                />
                <View style={styles.shadowWrapper}>
                    <View style={styles.inputBox}>
                        {
                            isLoading ?
                                <Text style={styles.overlayText}>이거 완전 럭키비키 잖아~</Text>
                                :
                                <Text style={styles.overlayText}>{luckyVicky}</Text>
                        }
                    </View>
                </View>

            </View>
        </View>
    );
}
