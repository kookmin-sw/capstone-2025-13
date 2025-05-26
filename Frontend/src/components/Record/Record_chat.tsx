import React from "react";
import { View, Image, Text, ScrollView, } from "react-native";
import styles from "../../styles/Record/recordChatStyles";

interface RecordChatProps {
    luckyVicky: string,
    isLoading: boolean,
}

export default function RecordChat({ luckyVicky, isLoading }: RecordChatProps) {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require("../../assets/Images/clover_profile.png")}
                    style={styles.profileImage}
                />
                <View style={styles.shadowWrapper}>
                    <View style={styles.inputBox}>
                        <ScrollView>
                            <Text style={styles.overlayText}>
                                {isLoading ? "답변 준비 중~~" : luckyVicky}
                            </Text>
                        </ScrollView>
                    </View>
                </View>

            </View>
        </View>
    );
}
