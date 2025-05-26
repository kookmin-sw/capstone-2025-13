import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPotStatus, useCoupon } from "../API/potAPI";
import potImage from "../assets/Images/pot_seed.png";
import potClover from "../assets/Images/pot_clover.png";
import potFlower from "../assets/Images/pot_flower.png";
import styles from "../styles/statusBoxStyles";
// const currentCoupon = potData.coupon - localCoupon;

export default function StatusBox() {
    const [potData, setPotData] = useState({
        level: 0,
        exp: 0,
        need: 1,
        coupon: 0,
    });
    const [localCoupon, setLocalCoupon] = useState(0);

    const fetchPotStatus = async () => {
        try {
            const data = await getPotStatus();
            if (data) {
                setPotData(data);
            }
        } catch (error) {
            console.error("❌ 화분 상태 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchPotStatus();
        const loadLocalCoupon = async () => {
            const stored = await AsyncStorage.getItem("localCoupon");
            if (stored !== null) setLocalCoupon(Number(stored));
        };
        loadLocalCoupon();
    }, []);

    // localCoupon is persisted in AsyncStorage on change
    useEffect(() => {
        AsyncStorage.setItem("localCoupon", String(localCoupon));
    }, [localCoupon]);

    // currentCoupon is potData.coupon - localCoupon (remaining coupons on server)
    const currentCoupon = potData.coupon - localCoupon;

    // handleWater: increment localCoupon, persist, and if exp+localCoupon >= need, sync with server
    const handleWater = async () => {
        const newLocalCoupon = localCoupon + 1;
        setLocalCoupon(newLocalCoupon);
        await AsyncStorage.setItem("localCoupon", String(newLocalCoupon));

        const newExp = potData.exp + newLocalCoupon;
        if (newExp >= potData.need) {
            try {
                console.log("레벨업! 서버에 동기화 중...");
                await useCoupon(newLocalCoupon);
                await fetchPotStatus();
                setLocalCoupon(0);
                await AsyncStorage.setItem("localCoupon", "0");
            } catch (error) {
                console.error("레벨업 동기화 실패:", error);
            }
        }
    };
    const progressRatio = Math.min(
        (potData.exp + localCoupon) / potData.need,
        1
    );

    let potImageSource = potImage;
    if (progressRatio > 0.7) {
        potImageSource = potFlower;
    } else if (progressRatio > 0.2) {
        potImageSource = potClover;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ position: "absolute", top: 10, right: 10 }}
                onPress={() => {
                    Alert.alert(
                        "나만의 토끼풀 정원을 만들자! 🌸",
                        "- 물 주기 쿠폰은 다양한 활동(검사, 매일 1주제, 일기, 퀘스트)들을 통해 얻을 수 있어! 😼🎟️\n- 물 주기 쿠폰을 사용해서 레벨업 게이지를 채우면 꽃 한 송이가 완성돼! 🪴💧\n- 꽃을 열심히 가꿔서 나만의 예쁜 클로버 정원을 가꿔보자 - 🏡☘️"
                    );
                }}
            >
                <MaterialCommunityIcons
                    name="information-outline"
                    size={24}
                    color="#aaa"
                />
            </TouchableOpacity>
            <View style={styles.levelWrapper}>
                <Text style={styles.levelText}>{potData.level - 1}송이</Text>
            </View>

            <Image source={potImageSource} style={styles.potImage} />

            <View style={styles.progressButtonRow}>
                <View style={styles.progressContainer}>
                    <View
                        style={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "#E0E0E0",
                            overflow: "hidden",
                        }}
                    >
                        <View
                            style={[
                                styles.progressBar,
                                { width: `${progressRatio * 100}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {potData.exp + localCoupon}/{potData.need}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        currentCoupon <= 0 && { backgroundColor: "#ccc" },
                    ]}
                    onPress={handleWater}
                    disabled={currentCoupon <= 0}
                >
                    <View style={styles.buttonContent}>
                        <MaterialCommunityIcons
                            name="water"
                            size={16}
                            color="#fff"
                            style={styles.waterIcon}
                        />
                        <Text style={styles.buttonText}>
                            X {currentCoupon} 물 주기
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
