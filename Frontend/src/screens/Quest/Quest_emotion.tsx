import {Face, FaceDetectionOptions, useFaceDetector} from "react-native-vision-camera-face-detector";
import {useEffect, useRef} from "react";
import {Camera, runAsync, useCameraDevice, useFrameProcessor} from "react-native-vision-camera";
import { Worklets } from 'react-native-worklets-core'
import {View} from "react-native";

export default function Quest_emotion() {
    const faceDetectionOptions = useRef<FaceDetectionOptions>({

    }).current;

    const device = useCameraDevice('front')
    const { detectFaces } = useFaceDetector()

    useEffect(() => {
        (async() => {
            const status = await Camera.requestCameraPermission()
            console.log({ status })
        })()
    }, [device])

    const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
        console.log('faces detected', faces)
    })

    const frameProcessor = useFrameProcessor(
        (frame) => {
            "worklet";
            const faces = detectFaces(frame);
            handleDetectedFaces(faces);
        },
        [handleDetectedFaces]
    );

    // @ts-ignore
    return (
        <View style={{ flex: 1 }}>
            { !!device? <Camera
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'black',
                }}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
            /> : <Text>
                No Device
            </Text> }
        </View>
    )
}