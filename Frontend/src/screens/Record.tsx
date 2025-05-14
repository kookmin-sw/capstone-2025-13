import React, { useState } from "react";
import { View, ScrollView, Image, Text, TextInput, TouchableOpacity } from "react-native";
import RecordHeader from "../components/RecordHeader";
import RecordInputBox from "../components/RecordInputBox";
import StarRating from "../components/StarRating";
import RecordChat from "../components/Record_chat";
import RecordEtc from "../components/Record_etc";
import styles from "../styles/recordStyles";

export default function Record() {
    const [recordId, setRecordId] = useState<string>("");
    const [luckyVicky, setLuckyVicky] = useState<string>("이거 완전 럭키비키 잖아~");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [recordEtcText, setRecordEtcText] = useState<string>("");

    const handleRecordIdUpdate = (id: string) => {
        setRecordId(id);
    };
    const handleLuckyVickyUpdate = (luckyVicky: string) => {
        setLuckyVicky(luckyVicky);
    };
    return (
        <View style={styles.container}>
            <RecordHeader />
            <ScrollView contentContainerStyle={[styles.scroll, { alignItems: 'center' }]}>
                <StarRating />
                <RecordInputBox onRecordIdUpdate={handleRecordIdUpdate} onLuckyVickyUpdate={handleLuckyVickyUpdate} setIsLoading={setIsLoading} />
                <RecordChat luckyVicky={luckyVicky} isLoading={isLoading} />
                <RecordEtc onRecordEtcUpdate={setRecordEtcText} />
                <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>저장</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

