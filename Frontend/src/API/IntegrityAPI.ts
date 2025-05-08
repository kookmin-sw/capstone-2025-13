import DeviceInfo from 'react-native-device-info'
import axios from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AxiosResponse} from "axios";
import * as Integrity from '@dalbodeule/expo-app-integrity';
import {Platform} from "react-native";

const EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT;

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

export const requestChallenge = async() => {
    const deviceId = await getDeviceId()

    try {
        const response = await axios.post('/api/integrity/challenge', {
            deviceId
        }) as AxiosResponse<RequestChallengeResponse>

        const expDate = new Date()
        expDate.setMinutes(expDate.getMinutes() + response.data.expiresInMinutes)

        await AsyncStorage.setItem('integrityChallenge', response.data.challenge);
        await AsyncStorage.setItem('integrityChallengeExp', expDate.toISOString())

        return response.data.challenge;
    } catch(error: any) {
        console.error('Failed to get challenge: ' + error.message);
        throw error;
    }
}

export const verifyDeviceIntegrity = async()=> {
    let challenge = await AsyncStorage.getItem('integrityChallenge');
    const expDate = await AsyncStorage.getItem('integrityChallengeExp');
    const deviceId = await getDeviceId()
    const platform = Platform.OS;
    const bundleId = getBundleId();

    if(!challenge || (expDate && new Date(expDate).getTime() < Date.now())) {
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

        const response = await axios.post('/api/integrity/verify', {
            platform,
            attestation,
            bundleId,
            challenge,
            deviceId
        }, {
            timeout: 30 * 1000,
            maxRedirects: 5,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            transitional: {
                forcedJSONParsing: false,
            }
        }) as AxiosResponse<VerifyDeviceIntegrityResponse>

        if(response.data.isValid) {
            await AsyncStorage.removeItem('integrityChallenge');
        }

        return response.data;
    } catch(error: any) {
        console.error('Failed to verify integrity: ' + error.message);
        throw error;
    }
}