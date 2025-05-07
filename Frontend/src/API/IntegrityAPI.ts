import DeviceInfo from 'react-native-device-info'
import axios from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AxiosResponse} from "axios";
import * as Integrity from 'expo-app-integrity';
import {Platform} from "react-native";

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

export const requestChallenge = async() => {
    const deviceId = await getDeviceId()

    try {
        const response = await axios.post('/api/integrity/challenge', {
            deviceId
        }) as AxiosResponse<RequestChallengeResponse>

        await AsyncStorage.setItem('integrityChallenge', response.data.challenge);
        await AsyncStorage.setItem('integrityDeviceId', deviceId);

        return response.data.challenge;
    } catch(error: any) {
        console.error('Failed to get challenge:', error);
        throw error;
    }
}

export const verifyDeviceIntegrity = async()=> {
    let challenge = await AsyncStorage.getItem('integrityChallenge');
    const deviceId = getDeviceId()

    if(!challenge) {
        challenge = await requestChallenge();
    }

    try {
        const googleCloudProject: number = parseInt(process.env.GOOGLE_CLOUD_PROJECT);
        const attestation = await Integrity.attestKey(challenge, googleCloudProject);

        const verificationResponse = await axios.post('/api/integrity/verify', {
            platform: Platform.OS,
            attestation,
            bundleId: DeviceInfo.getBundleId(),
            challenge,
            deviceId
        }) as AxiosResponse<VerifyDeviceIntegrityResponse>

        if(verificationResponse.data.isValid) {
            await AsyncStorage.removeItem('integrityChallenge');
        }

        return verificationResponse.data;
    } catch(error: any) {
        console.error('Failed to verify integrity:', error);
        throw error;
    }
}