import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Alert,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import colors from "../constants/colors";
import { Image } from "react-native";

export default function HelpCall() {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null>(null);

    const [selected, setSelected] = useState("all");
    const [markers, setMarkers] = useState<
        { id: string; latitude: number; longitude: number; title: string; type: string }[]
    >([]);

    const filteredMarkers =
        selected === "all"
            ? markers
            : markers.filter((marker) => marker.type === selected);
    const getMarkerImageByType = (type: string) => {
        switch (type) {
            case "clinic":
                return require("../assets/Images/clinic.png");
            case "center":
                return require("../assets/Images/center.png");
            case "counseling":
                return require("../assets/Images/counseling.png");
            // 기본 마커
        }
    };

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("위치 권한이 필요합니다.");
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = loc.coords;

            setLocation({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            // 위치 기준 예시 마커 설정
            setMarkers([
                {
                    id: "1",
                    title: "서울정신건강의원",
                    latitude: latitude + 0.001,
                    longitude: longitude + 0.001,
                    type: "clinic",
                },
                {
                    id: "2",
                    title: "강남정신건강복지센터",
                    latitude: latitude - 0.0015,
                    longitude: longitude + 0.001,
                    type: "center",
                },
                {
                    id: "3",
                    title: "행복정신상담센터",
                    latitude: latitude + 0.001,
                    longitude: longitude - 0.0015,
                    type: "counseling",
                },
            ]);
        })();
    }, []);


    if (!location) return null;

    const buttons = [
        { id: "all", title: "전체보기" },
        { id: "clinic", title: "정신건강진료" },
        { id: "center", title: "정신건강복지센터" },
        { id: "counseling", title: "정신상담센터" },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>마음 케어 정보 지도</Text>
                <ScrollView
                    style={{ marginTop: 10 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {buttons.map((btn) => (
                        <TouchableOpacity
                            key={btn.id}
                            style={[
                                styles.button,
                                selected === btn.id ? styles.selectedButton : styles.unselectedButton,
                            ]}
                            onPress={() => setSelected(btn.id)}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    selected === btn.id ? styles.selectedText : styles.unselectedText,
                                ]}
                            >
                                {btn.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

            </View>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={location}
                showsUserLocation={true}
            >
                <Marker coordinate={location} title="내 위치" />
                {filteredMarkers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        }}
                        title={marker.title}
                        image={getMarkerImageByType(marker.type)}
                    />
                ))}


            </MapView>
            <TouchableOpacity>
                <Image
                    source={require("../assets/Images/call.png")}
                    style={styles.callButton}
                />
            </TouchableOpacity>
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
        fontSize: 22,
        textAlign: "center",
    },
    scrollContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 40,
        marginHorizontal: 5,
        borderWidth: 1,
    },
    selectedButton: {
        backgroundColor: colors.green,
        borderColor: colors.green,
    },
    unselectedButton: {
        backgroundColor: "white",
        borderColor: colors.darkGrey,
    },
    buttonText: {
        fontWeight: "bold",
        textAlign: "center",
    },
    selectedText: {
        color: "white",
    },
    unselectedText: {
        color: colors.darkGrey,
    },
    callButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    }
});
