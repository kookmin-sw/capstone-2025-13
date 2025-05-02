// MarkerDetailCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

interface MarkerDetails {
    address: string;
    phone: string;
    openTime: string;
    closeTime: string;
    restDays: string;
    area: string;
    doctors: string;
    nurses: string;
    psychologists: string;
    jobDesc: string;
    etcStatus: string;
    etcUseInfo: string;
    operator: string;
    referenceDate: string;
    institution: string;
}

interface MarkerDetailCardProps {
    details: MarkerDetails;
    onClose: () => void;
}

export default function MarkerDetailCard({ details, onClose }: MarkerDetailCardProps) {
    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>
                <Text style={{ fontSize: 16, color: colors.green, fontWeight: 'bold' }}>닫기</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{details.operator}</Text>
            <Text><Text style={styles.boldText}>센터명:</Text> {details.institution}</Text>
            <Text>
                <Text style={styles.boldText}>주요업무: </Text>
                {details.jobDesc.split('+').map((part, index) => (
                    <Text key={index}>
                        {part}
                        {index < details.jobDesc.split('+').length - 1 && <Text>{', '}</Text>}
                    </Text>
                ))}
            </Text>
            <Text><Text style={styles.boldText}>주소:</Text> {details.address}</Text>
            <Text><Text style={styles.boldText}>전화번호:</Text> {details.phone}</Text>
            <Text><Text style={styles.boldText}>운영시간:</Text> {details.openTime} ~ {details.closeTime}</Text>
            <Text><Text style={styles.boldText}>휴무일:</Text> {details.restDays}</Text>
            <Text><Text style={styles.boldText}>센터 면적:</Text> {details.area}㎡</Text>
            <Text><Text style={styles.boldText}>의사 수:</Text> {details.doctors}</Text>
            <Text><Text style={styles.boldText}>간호사 수:</Text> {details.nurses}</Text>
            <Text><Text style={styles.boldText}>심리상담사 수:</Text> {details.psychologists}</Text>
            <Text><Text style={styles.boldText}>기타 인력 현황:</Text> {details.etcStatus}</Text>
            <Text><Text style={styles.boldText}>기타 이용 안내:</Text> {details.etcUseInfo}</Text>
            <Text><Text style={styles.boldText}>데이터 기준일자:</Text> {details.referenceDate}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        width: 300,
        maxHeight: 400,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    boldText: {
        fontWeight: 'bold',
    }
});
