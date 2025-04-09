import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import SignIn from './screens/SignIn';
import SignUpStep1 from './screens/SignUp/SignUpStep1';
import SignUpStep2 from './screens/SignUp/SignUpStep2';
import SimpleDiagnosis from './screens/SimpleDiagnosis/SimpleDiagnosis';
import SignUpStep3 from './screens/SignUp/SignUpStep3';
import Game from './screens/Game';

export type RootStackParamList = {
    Home: undefined;
    SignIn: undefined;
    SignUpStep1: undefined;
    SimpleDiagnosis: { initialIndex: number; score?: number; nickname?: string; birthdate?: string; gender?: string };
    SignUpStep2: { nickname: string };
    SignUpStep3: { nickname: string; birthdate: string; gender: string };
    Game: { score?: number };
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SimpleDiagnosis">
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen name="SignIn" options={{ headerShown: false }}>
                    {() => <SignIn/>}
                </Stack.Screen>
                <Stack.Screen name="SignUpStep1" options={{ headerShown: false }} component={SignUpStep1} />
                <Stack.Screen name="SignUpStep2" options={{ headerShown: false }}>
                    {() => <SignUpStep2 />}
                </Stack.Screen>
                <Stack.Screen name="SignUpStep3" options={{ headerShown: false }}>
                    {() => <SignUpStep3 />}
                </Stack.Screen>
                <Stack.Screen name="SimpleDiagnosis" options={{ headerShown: false }} component={SimpleDiagnosis} />
                <Stack.Screen name="Game" options={{ headerShown: false }}>
                    {() => <Game />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
