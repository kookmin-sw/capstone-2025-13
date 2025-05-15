import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles/starRatingStyles";

type StarRatingProps = {
    onRecordEtcUpdate: (rating: number) => void;
    initialRating?: number;
};

export default function StarRating({ onRecordEtcUpdate, initialRating = 0 }: StarRatingProps) {
    const [rating, setRating] = useState(0);
    const handleRatingChange = (rating: number) => {
        setRating(rating);
        onRecordEtcUpdate(rating);
    };
    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

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
