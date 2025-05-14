import React, { useState } from "react";
import { View, ScrollView, Image, Text, TextInput, TouchableOpacity } from "react-native";
import RecordHeader from "../components/RecordHeader";
import RecordInputBox from "../components/RecordInputBox";
import StarRating from "../components/StarRating";
import RecordChat from "../components/Record_chat";
import RecordEtc from "../components/Record_etc";
import styles from "../styles/recordStyles";
import { postRecord } from "../API/recordAPI";

export default function Record() {
    const [recordId, setRecordId] = useState<string>("");
    const [luckyVicky, setLuckyVicky] = useState<string>("이거 완전 럭키비키 잖아~");
    const [isLuckyLoading, setIsLuckyLoading] = useState<boolean>(false);
    const [recordEtcText, setRecordEtcText] = useState<string>("");
    const [rating, setRating] = useState(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRecordIdUpdate = (id: string) => {
        setRecordId(id);
    };
    const handleLuckyVickyUpdate = (luckyVicky: string) => {
        setLuckyVicky(luckyVicky);
    };
    const handleRatingChange = (rating: number) => {
        setRating(rating);
    };

    const handleSave = async () => {
        if (rating === 0) {
            alert("별점을 입력해주세요!");
            return;
        }
        setIsLoading(true);
        try {
            const response = await postRecord(recordId, rating, recordEtcText);
            if (response) {
                console.log("저장 완료", "일기가 성공적으로 저장되었습니다.");
            }
        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장 실패 \n일기 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <RecordHeader />
            <ScrollView contentContainerStyle={[styles.scroll, { alignItems: 'center' }]}>
                <StarRating onRecordEtcUpdate={handleRatingChange} />
                <RecordInputBox onRecordIdUpdate={handleRecordIdUpdate} onLuckyVickyUpdate={handleLuckyVickyUpdate} setIsLoading={setIsLuckyLoading} />
                <RecordChat luckyVicky={luckyVicky} isLoading={isLuckyLoading} />
                <RecordEtc onRecordEtcUpdate={setRecordEtcText} />
                <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                    <Image source={require("../assets/Images/save_bttn.png")} style={styles.submitButtonImg} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

