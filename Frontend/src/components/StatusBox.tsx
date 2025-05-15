import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getPotStatus, useCoupon } from "../API/potAPI";
import potImage from "../assets/Images/pot_seed.png";
import styles from "../styles/statusBoxStyles";

export default function StatusBox() {
    const [potData, setPotData] = useState({
        level: 0,
        exp: 0,
        need: 1,
        coupon: 0,
    });

    const fetchPotStatus = async () => {
        try {
            const data = await getPotStatus();
            if (data) {
                console.log("🎫 [DEBUG] 현재 쿠폰 수:", data.coupon);
                setPotData(data);
            }
        } catch (error) {
            console.error("❌ 화분 상태 불러오기 실패:", error);
        }
    };

    const handleWater = async () => {
        try {
            await useCoupon();
            await fetchPotStatus();
        } catch (error) {
            console.error("❌ 물주기 실패:", error);
        }
    };

    useEffect(() => {
        fetchPotStatus();
    }, []);

    const progressRatio = Math.min(potData.exp / potData.need, 1);

    return (
        <View style={styles.container}>
            <View style={styles.levelWrapper}>
                <Text style={styles.levelText}>{potData.level - 1}송이</Text>
            </View>

            <Image source={potImage} style={styles.potImage} />

            <View style={styles.progressWrapper}>
                <View
                    style={[
                        styles.progressBar,
                        { width: `${progressRatio * 100}%` },
                    ]}
                />
                <Text style={styles.progressText}>
                    {potData.exp}/{potData.need}
                </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleWater}>
                <Text style={styles.buttonText}>
                    <MaterialCommunityIcons
                        name="water"
                        size={16}
                        color="#fff"
                    />{" "}
                    X{potData.coupon} 물 주기
                </Text>
            </TouchableOpacity>
        </View>
    );
}
