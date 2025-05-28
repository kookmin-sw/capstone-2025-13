import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { secondPasswordStyles } from "../styles/secondPasswordStyles";
import { Ionicons } from "@expo/vector-icons";
import { useLoading } from "../API/contextAPI";

export default function SecondPassword({ route }: any) {
    const [password, setPassword] = useState("");
    const [storedPassword, setStoredPassword] = useState("");

    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { nextScreen } = route.params;
    const { showLoading, hideLoading } = useLoading();
    useEffect(() => {
        const fetchPassword = async () => {
            showLoading();
            try {
                const saved = await AsyncStorage.getItem("@secondPassword");
                if (saved) {
                    setStoredPassword(saved);
                }
            } catch (error) {
                console.error("비밀번호 불러오기 실패:", error);
            }
            hideLoading();
        };

        fetchPassword();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem("secondPasswordPassed", "false");
    }, []);
    useEffect(() => {
        if (password.length === 4) {
            const validatePassword = async () => {
                if (password === storedPassword) {
                    try {
                        await AsyncStorage.setItem(
                            "secondPasswordPassed",
                            "true"
                        );
                        navigation.reset({
                            index: 0,
                            routes: [{ name: nextScreen }],
                        });
                    } catch (error) {
                        console.error("2차 비밀번호 통과 저장 실패:", error);
                    }
                } else {
                    Alert.alert("비밀번호가 틀렸습니다.");
                    setPassword("");
                }
            };
            validatePassword();
        }
    }, [password]);

    const handlePress = (number: string) => {
        if (password.length < 4) {
            setPassword(password + number);
        }
    };

    const handleDelete = () => {
        setPassword(password.slice(0, -1));
    };

    const handleClear = () => {
        setPassword("");
    };

    const getCloverImage = (index: number) => {
        return index < password.length
            ? require("../assets/Images/colored_clover.png")
            : require("../assets/Images/clover.png");
    };

    return (
        <View style={secondPasswordStyles.container}>
            <View style={secondPasswordStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Home", {})}
                    style={secondPasswordStyles.backButtonWrapper}
                >
                    <Ionicons
                        name="arrow-back-circle"
                        size={40}
                        color="#349C64"
                    />
                </TouchableOpacity>
            </View>
            <View style={secondPasswordStyles.centerContent}>
                <Text style={secondPasswordStyles.title}>
                    비밀번호를 입력해라!
                </Text>

                <View style={secondPasswordStyles.passwordContainer}>
                    {[0, 1, 2, 3].map((index) => (
                        <Image
                            key={index}
                            source={getCloverImage(index)}
                            style={secondPasswordStyles.clover}
                        />
                    ))}
                </View>
            </View>

            <View style={secondPasswordStyles.keypad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={secondPasswordStyles.keyButton}
                        onPress={() => handlePress(String(num))}
                    >
                        <Text style={secondPasswordStyles.keyText}>{num}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    style={secondPasswordStyles.keyButton}
                    onPress={handleClear}
                >
                    <Text style={secondPasswordStyles.smallText}>전체삭제</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={secondPasswordStyles.keyButton}
                    onPress={() => handlePress("0")}
                >
                    <Text style={secondPasswordStyles.keyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={secondPasswordStyles.keyButton}
                    onPress={handleDelete}
                >
                    <Image
                        source={require("../assets/Images/delete.png")}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
