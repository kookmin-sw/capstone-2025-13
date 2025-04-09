import React from "react";
import { View, ScrollView } from "react-native";
import Header from "../components/Header";
import StatusBox from "../components/StatusBox";
import MenuButton from "../components/MenuButton";
import BottomBar from "../components/BottomBar";

export default function Home() {
    return (
        <ScrollView style={{ backgroundColor: "#F9F9E7", flex: 1 }}>
            <Header />
            <StatusBox />
            <MenuButton
                title="마음 건강 진단"
                subtitle="PHQ-9 기반 설문 자가 진단하기"
                onPress={() => {}}
            />
            <MenuButton title="일기" onPress={() => {}} />
            <MenuButton title="퀘스트" onPress={() => {}} />
            <BottomBar />
        </ScrollView>
    );
}
