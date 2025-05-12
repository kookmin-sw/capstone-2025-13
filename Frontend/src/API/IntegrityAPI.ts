import DeviceInfo from 'react-native-device-info'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Integrity from '@dalbodeule/expo-app-integrity';
import {Platform} from "react-native";
import axios from "./axios";
import * as SecureStore from "expo-secure-store";
import {SECURE_STORAGE_KEYS} from "@dalbodeule/expo-app-integrity/src/config";

const EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT;
const apiUrl =  process.env.EXPO_PUBLIC_API_URL;

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
        const response = await axios.post<RequestChallengeResponse>(`${apiUrl}/api/integrity/challenge`,
            { deviceId },
            {}
        )

        const data = response.data;
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

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

        let attestation = null
        let keyId = null

        try {
            if (platform == "ios") {
                if(!Integrity.isSupported())
                    throw Error("Integrity is not supported on this device");
                attestation = await Integrity.attestKey(challenge);
                keyId = await SecureStore.getItemAsync(
                    SECURE_STORAGE_KEYS.INTEGRITY_KEY_IDENTIFIER,
                )
            } else if (platform == "android") {
                attestation = await Integrity.attestKey(challenge, googleCloudProject);
            } else throw Error("Platform not supported");
        } catch (error) { throw error }

        console.log({
            platform,
            attestation,
            bundleId,
            challenge,
            deviceId,
            keyId
        })

        const response = await axios.post<VerifyDeviceIntegrityResponse>(`${apiUrl}/api/integrity/verify`, {
            platform,
            attestation,
            bundleId,
            challenge,
            deviceId,
            keyId
        }, {

        });

        const data = response.data
        if (response.status !== 200 || !data.isValid) {
            throw new Error(`HTTP error! status: ${response.status} / ${data.message} / ${data.details ? JSON.stringify(data.details) : ''}`);
        }

        if (data.isValid) {
            await AsyncStorage.removeItem('integrityChallenge');
            await AsyncStorage.removeItem('integrityChallengeExp');
        }
        return data;
    } catch (error: any) {
        console.error(`Failed to verify integrity: ${error.message} / ${error.details ? JSON.stringify(error.details) : ''}`);
        throw error;
    }
}
