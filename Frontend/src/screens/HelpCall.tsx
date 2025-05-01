import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Text, Platform, Button } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HelpCall() {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("위치 권한이 필요합니다.");
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    if (!location) return null;

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>마음 케어 정보 지도</Text>
                <ScrollView
                    style={{ marginTop: 10 }}
                    horizontal={true}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <Button title="Button 1" onPress={() => { }} />
                    <Button title="Button 2" onPress={() => { }} />
                    <Button title="Button 3" onPress={() => { }} />

                </ScrollView>
            </View>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={location}
                showsUserLocation={true}
            >
                <Marker coordinate={location} title="내 위치" />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    headerBox: {
        backgroundColor: "white",
        paddingHorizontal: 10,
        elevation: Platform.OS === "android" ? 10 : 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        width: "100%",
        height: "20%",
        justifyContent: "center",
        zIndex: 10,
        paddingTop: 40,
    },

    headerText: {
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },

    scrollContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});
