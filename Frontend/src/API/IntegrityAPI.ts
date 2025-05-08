import DeviceInfo from 'react-native-device-info'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Integrity from '@dalbodeule/expo-app-integrity';
import {Platform} from "react-native";

const EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export interface RequestChallengeResponse {
    challenge: string;
    expiresInMinutes: number;
}

export interface VerifyDeviceIntegrityResponse {
    isValid: boolean;
    message: string;
    details: Map<string, any> | undefined
}

const getDeviceId = async() => {
    return await DeviceInfo.getUniqueId()
}

const getBundleId = () => {
    return DeviceInfo.getBundleId();
}

export const requestChallenge = async () => {
    const deviceId = await getDeviceId()

    try {
        const response = await fetch(`${apiUrl}/api/integrity/challenge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({deviceId})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as RequestChallengeResponse;
        const expDate = new Date()
        expDate.setMinutes(expDate.getMinutes() + data.expiresInMinutes)

        await AsyncStorage.setItem('integrityChallenge', data.challenge);
        await AsyncStorage.setItem('integrityChallengeExp', expDate.toISOString())

        return data.challenge;
    } catch (error: any) {
        console.error('Failed to get challenge: ' + error.message);
        throw error;
    }
}

export const verifyDeviceIntegrity = async () => {
    let challenge = await AsyncStorage.getItem('integrityChallenge');
    const expDate = await AsyncStorage.getItem('integrityChallengeExp');
    const deviceId = await getDeviceId()
    const platform = Platform.OS;
    const bundleId = getBundleId();

    if (!challenge || (expDate && new Date(expDate).getTime() < Date.now())) {
        challenge = await requestChallenge();
    }

    try {
        const googleCloudProject: number = parseInt(EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT);
        const attestation = await Integrity.attestKey(challenge, googleCloudProject);

        console.log({
            platform,
            attestation,
            bundleId,
            challenge,
            deviceId
        })

        const response = await fetch(`${apiUrl}/api/integrity/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                platform,
                attestation,
                bundleId,
                challenge,
                deviceId
            }),
            keepalive: true
        });

        const data = await response.json() as VerifyDeviceIntegrityResponse;
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} / ${data.message} / ${data.details ? JSON.stringify(data.details) : ''}`);
        }

        if (data.isValid) {
            await AsyncStorage.removeItem('integrityChallenge');
        }

        return data;
    } catch (error: any) {
        console.error(`Failed to verify integrity: ${error.message} / ${error.details ? JSON.stringify(error.details) : ''}`);
        throw error;
    }
}
