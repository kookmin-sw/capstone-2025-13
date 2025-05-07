import React from "react";
import { View, ScrollView } from "react-native";
import RecordHeader from "../components/RecordHeader";
import RecordInputBox from "../components/RecordInputBox";
import StarRating from "../components/StarRating";
import SubmitRecordButton from "../components/SubmitRecordButton";
import styles from "../styles/recordStyles";

export default function Record() {
    return (
        <View style={styles.container}>
            <RecordHeader />
            <ScrollView contentContainerStyle={styles.scroll}>
                <RecordInputBox />
                <StarRating />
                <SubmitRecordButton />
            </ScrollView>
        </View>
    );
}
