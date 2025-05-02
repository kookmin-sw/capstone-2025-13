import React, { useEffect, useState } from "react";
import {
    View,
    Alert,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import helpCallStyles from "../styles/helpCallStyles";

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
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
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
        <View style={helpCallStyles.container}>
            <StatusBar style="auto" />
            <View style={helpCallStyles.headerBox}>
                <Text style={helpCallStyles.headerText}>마음 케어 정보 지도</Text>
                <ScrollView
                    style={{ marginTop: 10 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={helpCallStyles.scrollContainer}
                >
                    {buttons.map((btn) => (
                        <TouchableOpacity
                            key={btn.id}
                            style={[
                                helpCallStyles.button,
                                selected === btn.id ? helpCallStyles.selectedButton : helpCallStyles.unselectedButton,
                            ]}
                            onPress={() => setSelected(btn.id)}
                        >
                            <Text
                                style={[
                                    helpCallStyles.buttonText,
                                    selected === btn.id ? helpCallStyles.selectedText : helpCallStyles.unselectedText,
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
                style={helpCallStyles.map}
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
                    style={helpCallStyles.callButton}
                />
            </TouchableOpacity>
        </View>
    );
}

