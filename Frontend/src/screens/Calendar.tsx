import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { SetStateAction, useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import calendarStyles from "../styles/calendarStyles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import { Ionicons } from "@expo/vector-icons";

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState(5);
    const [attendanceRate, setAttendanceRate] = useState(0);
    const attendanceDates = ['2025-05-01', '2025-05-03', '2025-05-06', '2025-05-24'];
    const navigation =
            useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const generateMarkedDates = (selectedDate: string) => {
        const marked: { [date: string]: any } = {};

        attendanceDates.forEach(date => {
            marked[date] = {
                selected: date === selectedDate,
                selectedColor: '#FF9B4B',
                dots: [{
                    key: 'check',
                    color: date === selectedDate ? '#ffffff' : '#FF9B4B',
                }],
                marked: true,
            };
        });

        // 선택된 날짜가 출석일이 아닌 경우도 포함
        if (!marked[selectedDate]) {
            marked[selectedDate] = {
                selected: true,
                selectedColor: '#FF9B4B',
            };
        }

        return marked;
    };

    useEffect(() => {
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const daysInMonth = new Date(year, month, 0).getDate();
        setAttendanceRate(attendance / daysInMonth);
    }, [attendance, selectedDate]);

    return (
        <View style={calendarStyles.container}>
            <View style={calendarStyles.header}>
            <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={calendarStyles.backButtonWrapper}
                >
                <Ionicons name="arrow-back-circle" size={40} color="#fff" />
            </TouchableOpacity>
                <Text style={calendarStyles.title}>달력</Text>  
            </View>
            <Calendar
                current={selectedDate}
                onDayPress={(day: { dateString: SetStateAction<string>; }) => setSelectedDate(day.dateString)}
                markedDates={generateMarkedDates(selectedDate)}
                markingType="multi-dot"
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#BDBDBD',
                    selectedDayBackgroundColor: '#FF9B4B',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#000000',
                    dayTextColor: '#333333',
                    arrowColor: '#B5BEC6',
                    monthTextColor: '#333333',
                    textMonthFontWeight: 'bold',
                    textMonthFontSize: 18,
                    textDayFontFamily: 'System',
                    textDayFontSize: 16,
                }}
                style={calendarStyles.calendar}
            />

            <View style={calendarStyles.attendanceBar}>
                <ProgressBar progress={attendanceRate} />
                <Text style={calendarStyles.attendanceText}>이번 달엔 <Text style={calendarStyles.count}>{attendance}번</Text>이나 출석했어요! 대단한데요?</Text>
            </View>

            <View style={calendarStyles.taskList}>
                <Text style={calendarStyles.dateTitle}>{formatDate(selectedDate)}</Text>
                {[1, 2, 3].map((_, index, array) => (
                    <View key={index}>
                        <View style={calendarStyles.taskItem}>
                            <View style={calendarStyles.dot} />
                            <View>
                                <Text style={calendarStyles.taskTitle}>마음 건강 검사 진행</Text>
                                <Text style={calendarStyles.taskSubtitle}>BDI 기반 검사</Text>
                            </View>
                        </View>
                        {index !== array.length - 1 && <View style={calendarStyles.divider} />}
                    </View>
                ))}

            </View>
        </View>
    );
}

function formatDate(dateString: string) {
    const [year, month, day] = dateString.split('-');
    return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}