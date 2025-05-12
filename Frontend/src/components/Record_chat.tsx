import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import styles from "../styles/recordChatStyles";

export default function RecordChat() {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image 
                    source={require("../assets/Images/clover_profile.png")} 
                    style={styles.profileImage} 
                />
                 <View style={styles.imageWrapper}>
                    <Image
                        resizeMode="contain"
                        source={require("../assets/Images/record_chat.png")} 
                        style={styles.inputImage} 
                    />
                    <Text style={styles.overlayText}>이거 완전 럭키비키 잖아~</Text>
                </View>
            </View>
        </View>
    );
}
