import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native"; // ⬅️ Text 추가
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles/starRatingStyles";

type StarRatingProps = {
    onRecordEtcUpdate: (rating: number) => void;
};

export default function StarRating({ onRecordEtcUpdate }: StarRatingProps) {
    const [rating, setRating] = useState(0);
    const handleRatingChange = (rating: number) => {
        setRating(rating);
        onRecordEtcUpdate(rating);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.caption}>
                오늘 하루는 별 몇 개 붙여줄 거야~?
            </Text>
            <View style={styles.starWrapper}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleRatingChange(index + 1)}
                    >
                        <MaterialCommunityIcons
                            name={index < rating ? "star" : "star-outline"}
                            size={32}
                            color="#FFD700"
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
