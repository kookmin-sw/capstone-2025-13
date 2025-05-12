import React from "react";
import { View, ScrollView, Image, Text, TextInput, TouchableOpacity } from "react-native";
import RecordHeader from "../components/RecordHeader";
import RecordInputBox from "../components/RecordInputBox";
import StarRating from "../components/StarRating";
import RecordChat from "../components/Record_chat";
import RecordEtc from "../components/Record_etc";
import styles from "../styles/recordStyles";

export default function Record() {
    return (
        <View style={styles.container}>
            <RecordHeader />
            <ScrollView contentContainerStyle={[styles.scroll, { alignItems: 'center' }]}>
                <StarRating />
                <RecordInputBox />
                <RecordChat/>
                <RecordEtc/>
                <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>저장</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

