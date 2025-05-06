import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import fonts from '../constants/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';


export default function SecondPassword({ route }: any) {
    const [password, setPassword] = useState('');
    const [storedPassword, setStoredPassword] = useState('');

    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { nextScreen } = route.params;
    useEffect(() => {
        const fetchPassword = async () => {
            try {
                const saved = await AsyncStorage.getItem("@secondPassword");
                if (saved) {
                    setStoredPassword(saved);
                }
            } catch (error) {
                console.error("비밀번호 불러오기 실패:", error);
            }
        };

        fetchPassword();
    }, []);


    useEffect(() => {
        if (password.length === 4) {
            const validatePassword = async () => {
                if (password === storedPassword) {
                    try {
                        await AsyncStorage.setItem("secondPasswordPassed", "true");
                        navigation.reset({
                            index: 0,
                            routes: [{ name: nextScreen }],
                        });
                    } catch (error) {
                        console.error("2차 비밀번호 통과 저장 실패:", error);
                    }
                } else {
                    Alert.alert("비밀번호가 틀렸습니다.");
                    setPassword('');
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
        setPassword('');
    };

    const getCloverImage = (index: number) => {
        return index < password.length
            ? require('../assets/Images/colored_clover.png')
            : require('../assets/Images/clover.png');
    };

    return (
        <View style={styles.container}>
            <View style={styles.centerContent}>
                <Text style={styles.title}>비밀번호를 입력해라!</Text>

                <View style={styles.passwordContainer}>
                    {[0, 1, 2, 3].map((index) => (
                        <Image
                            key={index}
                            source={getCloverImage(index)}
                            style={styles.clover}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.keypad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={styles.keyButton}
                        onPress={() => handlePress(String(num))}
                    >
                        <Text style={styles.keyText}>{num}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.keyButton} onPress={handleClear}>
                    <Text style={styles.smallText}>전체삭제</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.keyButton}
                    onPress={() => handlePress('0')}
                >
                    <Text style={styles.keyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keyButton} onPress={handleDelete}>
                    <Image
                        source={require('../assets/Images/delete.png')}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    title: {
        fontSize: 16,
        fontFamily: fonts.semiBold,
        marginVertical: 20,
    },
    passwordContainer: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 10,
    },
    clover: {
        width: 30,
        height: 30,
    },
    resetText: {
        color: '#999',
        fontSize: 12,
        marginBottom: 20,
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginHorizontal: 10,
        width: '100%',
        backgroundColor: "#1AA85C",
        padding: 20,
    },
    keyButton: {
        width: '30%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyText: {
        fontSize: 30,
        color: 'white',
        fontFamily: fonts.semiBold,
    },
    smallText: {
        fontSize: 16,
        color: 'white',
    },
});
