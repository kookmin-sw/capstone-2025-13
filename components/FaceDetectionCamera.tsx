import React, { forwardRef, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera-face-detector';
import { Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector';

interface FaceDetectionCameraProps {
  device: any;
  onFacesDetected: (faces: Face[]) => void;
  faceDetectionOptions?: FaceDetectionOptions;
}

export const FaceDetectionCamera = forwardRef<any, FaceDetectionCameraProps>(
  ({ device, onFacesDetected, faceDetectionOptions }, ref) => {
    const defaultOptions = useRef<FaceDetectionOptions>({
      performanceMode: 'accurate',
      classificationMode: 'none',
      landmarkMode: 'all',
    }).current;

    return (
      <Camera
        ref={ref}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        faceDetectionCallback={(faces) => onFacesDetected(faces)}
        faceDetectionOptions={faceDetectionOptions ?? defaultOptions}
      />
    );
  }
);

FaceDetectionCamera.displayName = 'FaceDetectionCamera';