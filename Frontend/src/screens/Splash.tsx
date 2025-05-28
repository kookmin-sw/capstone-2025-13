import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";

const Splash = () => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const darkenAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(3500),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(darkenAnim, {
                    toValue: 0.8,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <Image
                    source={require("../assets/Images/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
            <Animated.View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: "black",
                        opacity: darkenAnim,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1AA85C",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 200,
        height: 200,
    },
});

export default Splash;
