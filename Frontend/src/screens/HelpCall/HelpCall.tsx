// HelpCall.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Alert,
    Text,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import helpCallStyles from "../../styles/helpCallStyles";
import { getCenters } from "../../API/helpcallAPI";
import Spinner from "../Spinner";
import MarkerDetailCard from "../../components/MarkerDetailCard";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";

export default function HelpCall() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null>(null);

    const [selected, setSelected] = useState("all");
    const [markers, setMarkers] = useState<{
        id: string;
        latitude: number;
        longitude: number;
        title: string;
        type: string;
        details: any;
    }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMarker, setSelectedMarker] = useState<any>(null);

    const filteredMarkers =
        selected === "all"
            ? markers
            : markers.filter((marker) => marker.type === selected);

    const getMarkerImageByType = (type: string) => {
        switch (type) {
            case "clinic":
                return require("../../assets/Images/clinic.png");
            case "center":
                return require("../../assets/Images/center.png");
            case "counseling":
                return require("../../assets/Images/counseling.png");
            default:
                return null;
        }
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("위치 권한이 필요합니다.");
                setIsLoading(false);
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

            try {
                const centerData = await getCenters();
                const parsedMarkers = centerData
                    .filter((item: any) => item.hpCnterSe === "정신보건")
                    .map((item: any, index: number) => ({
                        id: `${index}`,
                        title: item.hpCnterNm ?? "정신건강센터",
                        latitude: parseFloat(item.latitude),
                        longitude: parseFloat(item.longitude),
                        type: "center",
                        details: {
                            address: item.rdnmadr,
                            phone: item.phoneNumber,
                            openTime: item.operOpenHhmm,
                            closeTime: item.operColseHhmm,
                            restDays: item.rstdeInfo,
                            area: item.hpCnterAr,
                            doctors: item.doctrCo,
                            nurses: item.nurseCo,
                            psychologists: item.scrcsCo,
                            jobDesc: item.hpCnterJob,
                            etcStatus: item.etcHnfSttus,
                            etcUseInfo: item.etcUseIfno,
                            operator: item.operInstitutionNm,
                            referenceDate: item.referenceDate,
                            institution: item.institutionNm,
                        },
                    }));

                setMarkers(parsedMarkers);
            } catch (error) {
                console.error("센터 데이터를 가져오는 데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
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
        <TouchableWithoutFeedback
            onPress={() => setSelectedMarker(null)}
        >
            <View style={helpCallStyles.container}>
                <StatusBar style="auto" />
                {isLoading && <Spinner />}
                {!isLoading && (
                    <>
                        <View style={helpCallStyles.headerBox}>
                        <TouchableOpacity
                            style={helpCallStyles.backButtonWrapper}
                            onPress={() => {
                            navigation.navigate("Home")}}
                        >
                            <Ionicons name="arrow-back-circle" size={40} color="green" />
                        </TouchableOpacity>


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
                                            selected === btn.id
                                                ? helpCallStyles.selectedButton
                                                : helpCallStyles.unselectedButton,
                                        ]}
                                        onPress={() => setSelected(btn.id)}
                                    >
                                        <Text
                                            style={[
                                                helpCallStyles.buttonText,
                                                selected === btn.id
                                                    ? helpCallStyles.selectedText
                                                    : helpCallStyles.unselectedText,
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
                                    onCalloutPress={() => setSelectedMarker(marker.details)}
                                />
                            ))}
                        </MapView>

                        {selectedMarker && (
                            <MarkerDetailCard
                                details={selectedMarker}
                                onClose={() => setSelectedMarker(null)}
                            />
                        )}
                        <TouchableOpacity
                            style={helpCallStyles.callButton
                            }
                            onPress={() => {
                                navigation.navigate("HelpCall2");
                            }}
                        >
                            <Image
                                source={require("../../assets/Images/call.png")}
                                style={{ width: 60, height: 60 }}
                            />
                        </TouchableOpacity>


                    </>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}
