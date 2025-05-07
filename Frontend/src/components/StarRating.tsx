import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles/starRatingStyles";

export default function StarRating() {
    const [rating, setRating] = useState(0);

    return (
        <View style={styles.container}>
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
    );
}
