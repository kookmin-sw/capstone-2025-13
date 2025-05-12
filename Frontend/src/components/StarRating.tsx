import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native"; // ⬅️ Text 추가
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles/starRatingStyles";

export default function StarRating() {
    const [rating, setRating] = useState(0);

    return (
        <View style={styles.container}>
            <Text style={styles.caption}>
                오늘 하루는 별 몇 개 붙여줄 거야~?
            </Text>
            <View style={styles.starWrapper}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setRating(index + 1)}
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
