// HelpCall2.tsx
import { ScrollView, Text, TouchableOpacity, View, Linking } from "react-native";
import helpCallStyles from "../../styles/helpCallStyles";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

const phoneData = [
    {
        id: "24hours",
        category: "24시간 이용 가능한 상담전화",
        data: [
            { name: "자살예방상담전화", phone: "109" },
            { name: "정신건강상담전화", phone: "1577-0199" },
            { name: "보건복지상담센터", phone: "129" },
            { name: "한국생명의전화", phone: "1588-9191" },
            { name: "청소년상담1388", phone: "(지역번호)1388" },
            { name: "문자상담", phone: "1661-5004" },
            { name: "117 학교 · 여성폭력 및 성매매피해자 신고센터", phone: "117" },
        ],
    },
    {
        id: "suicide_prevention",
        category: "자살예방사업 관련",
        data: [
            { name: "한국생명존중희망재단", phone: "02-3706-0500", website: "www.kfsp.or.kr" },
            { name: "서울시자살예방센터", phone: "02-3458-1000", website: "www.suicide.or.kr" },
            { name: "경기도자살예방센터", phone: "031-212-0437", website: "www.mentalhealth.or.kr" },
            { name: "인천광역시자살예방센터", phone: "032-468-9917", website: "www.ispc.or.kr" },
            { name: "강원특별자치도자살예방센터", phone: "033-251-1970", website: "www.gwmh.or.kr" },
            { name: "충청북도광역자살예방센터", phone: "043-217-0597", website: "cbsmind.or.kr" },
            { name: "충청남도광역자살예방센터", phone: "041-566-9184", website: "www.chmhc.or.kr" },
            { name: "대전광역자살예방센터", phone: "042-486-0005", website: "www.djpmhc.or.kr" },
            { name: "광주자살예방센터", phone: "062-600-1930", website: "www.gmhc.kr" },
            { name: "경상북도자살예방센터", phone: "054-748-6400", website: "gbmhc.or.kr" },
            { name: "대구광역자살예방센터", phone: "053-256-0199", website: "mental.dgmhc.or.kr" },
            { name: "울산광역자살예방센터", phone: "052-716-7199", website: "www.usspc.or.kr" },
            { name: "부산광역자살예방센터", phone: "051-242-2575", website: "www.bspc.kr" },
            { name: "제주특별자치도자살예방센터", phone: "064-717-3000", website: "www.jejumind.or.kr" },
        ],
    },
    {
        id: "youth",
        category: "아동・청소년 관련",
        data: [
            { name: "서울해바라기아동센터", phone: "02-3274-1375", website: "www.child1375.or.kr" },
            { name: "아동권리보장원", phone: "02-6454-8500", website: "www.ncrc.or.kr" },
            { name: "한국청소년상담복지개발원", phone: "051-662-3000", website: "www.kyci.or.kr" },
            { name: "한국청소년쉼터협의회", phone: "02-403-9171", website: "www.jikimi.or.kr" },
        ],
    },
    {
        id: "family_support",
        category: "가족지원서비스",
        data: [
            { name: "가족센터 (한국건강가정진흥원)", phone: "1577-9337", website: "www.familynet.or.kr" },
        ],
    },
    {
        id: "addiction",
        category: "중독 관련",
        data: [
            { name: "한국도박문제예방치유원", phone: "1336 (24시간)", website: "www.kcgp.or.kr" },
            { name: "한국마약퇴치운동본부", phone: "02-2677-2245", website: "www.drugfree.or.kr" },
        ],
    },
];

export default function HelpCall2() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [selected, setSelected] = useState("all");

    const buttons = [
        { id: "all", title: "전체보기" },
        { id: "24hours", title: "24시간 이용 가능한 상담전화" },
        { id: "suicide_prevention", title: "자살예방사업 관련" },
        { id: "youth", title: "아동・청소년 관련" },
        { id: "family_support", title: "가족지원서비스" },
        { id: "addiction", title: "중독 관련" },
    ];

    const filteredData =
        selected === "all"
            ? phoneData.flatMap((section) =>
                section.data.map((item) => ({ ...item, category: section.category }))
            )
            : phoneData
                .filter((section) => section.id === selected)
                .flatMap((section) =>
                    section.data.map((item) => ({ ...item, category: section.category }))
                );

    return (
        <View style={helpCallStyles.container}>
            <View style={helpCallStyles.headerBox}>
                <TouchableOpacity
                    style={helpCallStyles.backButtonWrapper}
                    onPress={() => {
                        navigation.navigate("HelpCall")}}
                >
                    <Ionicons name="arrow-back-circle" size={40} color="#1AA85C" />
                </TouchableOpacity>
                <Text style={helpCallStyles.headerText}>전화번호</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={helpCallStyles.scrollContainer}
                >
                    {buttons.map((btn) => (
                        <TouchableOpacity
                            key={btn.id}
                            style={[
                                helpCallStyles.button,
                                selected === btn.id
                                    ? helpCallStyles.selectedButton
                                    : helpCallStyles.unselectedButton,
                            ]}
                            onPress={() => setSelected(btn.id)}
                        >
                            <Text
                                style={[
                                    helpCallStyles.buttonText,
                                    selected === btn.id
                                        ? helpCallStyles.selectedText
                                        : helpCallStyles.unselectedText,
                                ]}
                            >
                                {btn.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={helpCallStyles.contentContainer}>
                {filteredData.map((item, index) => (
                    <View key={index} style={helpCallStyles.itemContainer}>
                        <Text style={helpCallStyles.itemTitle}>{item.name}</Text>
                        <Text
                            style={helpCallStyles.itemPhone}
                            onPress={() => Linking.openURL(`tel:${item.phone}`)}
                        >
                            📞 {item.phone}
                        </Text>
                        {"website" in item && item.website && (
                            <Text
                                style={helpCallStyles.itemWebsite}
                                onPress={() => Linking.openURL(`http://${item.website}`)}
                            >
                                {item.website}
                            </Text>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}