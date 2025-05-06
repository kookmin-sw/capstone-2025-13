import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import { SetStateAction, useEffect, useState } from "react";
import fonts from "../constants/fonts";
import ProgressBar from "../components/ProgressBar";
import colors from "../constants/colors";

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState(5);
    const [attendanceRate, setAttendanceRate] = useState(0);
    const attendanceDates = ['2025-05-01', '2025-05-03', '2025-05-06', '2025-05-24'];

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


const { width } = Dimensions.get("window");

const calendarStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.1,
        backgroundColor: "#4CAF50"
    },
    header: {
        paddingVertical: width * 0.05,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff",
        fontFamily: fonts.laundryBold,
    },
    calendar: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    attendanceBar: {
        marginTop: 16,
        alignItems: 'center',
    },
    attendanceText: {
        fontSize: 14,
        color: colors.white,
    },
    count: {
        fontWeight: 'bold',
        fontSize: 20,
        color: colors.white,
    },
    taskList: {
        marginTop: 16,
        backgroundColor: '#F2F3E5',
        borderRadius: 40,
        padding: 30,
    },
    dateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#714E25"
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 10,
    },
    dot: {
        width: 8,
        height: 8,
        backgroundColor: '#89673F',
        borderRadius: 4,
        marginTop: 6,
        marginRight: 10,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: "#89673F"
    },
    taskSubtitle: {
        fontSize: 13,
        color: '#89673F',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2D2BF',
        width: '100%',
        marginVertical: 3,
    },

});
