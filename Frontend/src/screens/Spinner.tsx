import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View, ImageStyle } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../styles/spinnerStyles";

const Spinner = () => {
    // Four separate animations for each leaf
    const leafAnimations = [0, 1, 2, 3].map(
        () => useRef(new Animated.Value(0)).current
    );

    const loadingText = "우웅 로딩 중 ~";
    const textAnimations = loadingText
        .split("")
        .map(() => useRef(new Animated.Value(0)).current);

    useEffect(() => {
        leafAnimations.forEach((anim, index) => {
            Animated.loop(
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 3000 + index * 300, // stagger durations
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        });

        textAnimations.forEach((anim, i) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: -10,
                        duration: 400,
                        delay: i * 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 10,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });
    }, []);

    const cloverColors = ["#C5E8B7", "#9CD769", "#4B9121", "#64A830"];

    const colorInterpolations = leafAnimations.map((anim, index) =>
        anim.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [
                cloverColors[(index + 0) % 4],
                cloverColors[(index + 1) % 4],
                cloverColors[(index + 2) % 4],
                cloverColors[(index + 3) % 4],
                cloverColors[(index + 0) % 4], // loop back
            ],
        })
    );

    const leafStyle = (
        rotate: string,
        translateX: number,
        translateY: number,
        colorAnim: Animated.AnimatedInterpolation<string | number>
    ): Animated.WithAnimatedObject<ImageStyle> => ({
        ...styles.leaf,
        tintColor: colorAnim,
        transform: [{ rotate }, { translateX }, { translateY }],
    });

    // const leafSpacingX = 100;
    // const leafSpacingY = 100;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.cloverContainer}>
                    <Animated.Image
                        source={require("../assets/Images/leaf.png")}
                        style={leafStyle(
                            "-45deg",
                            -25,
                            0,
                            colorInterpolations[0]
                        )} // Centered
                    />
                    <Animated.Image
                        source={require("../assets/Images/leaf.png")}
                        style={leafStyle(
                            "45deg",
                            -25,
                            0,
                            colorInterpolations[1]
                        )} // Right side
                    />
                    <Animated.Image
                        source={require("../assets/Images/leaf.png")}
                        style={leafStyle(
                            "135deg",
                            -25,
                            0,
                            colorInterpolations[2]
                        )} // Bottom-right
                    />
                    <Animated.Image
                        source={require("../assets/Images/leaf.png")}
                        style={leafStyle(
                            "-135deg",
                            -25,
                            0,
                            colorInterpolations[3]
                        )} // Bottom-left
                    />
                </View>
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                    {loadingText.split("").map((char, i) => (
                        <Animated.Text
                            key={i}
                            style={[
                                styles.loadingText,
                                {
                                    transform: [
                                        { translateY: textAnimations[i] },
                                    ],
                                },
                            ]}
                        >
                            {char}
                        </Animated.Text>
                    ))}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Spinner;
