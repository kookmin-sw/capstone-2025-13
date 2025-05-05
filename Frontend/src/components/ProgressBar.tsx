import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface ProgressBarProps {
    progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <View style={styles.container}>
            <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 16,
        backgroundColor: '#F5F2ED',
        borderRadius: 8,
        overflow: 'hidden',
        width: '100%',
    },
    fill: {
        height: '100%',
        backgroundColor: '#FF9B4B',
        borderRadius: 8,
    },
});
