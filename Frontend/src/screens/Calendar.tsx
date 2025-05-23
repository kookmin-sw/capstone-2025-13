import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { SetStateAction, useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import calendarStyles from "../styles/calendarStyles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import { Ionicons } from "@expo/vector-icons";
import { useSecondPasswordGuard } from "../hooks/useSecondPasswordGuard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBehaviors, getBehaviorsSummary } from "../API/calendarAPI";
import DepressionResultModal from "../components/DepressionResultModal";

type BehaviorType = "diagnosis" | "topic" | "quest" | "diary";

interface Behavior {
    title: string;
    content: string;
    type: BehaviorType;
    id: string | number;
}

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState(0);
    const [attendanceRate, setAttendanceRate] = useState(0);
    const [behaviors, setBehaviors] = useState<Behavior[]>([]);

    const [currentYearMonth, setCurrentYearMonth] = useState(() => {
        const now = new Date();
        const m = now.getMonth() + 1;
        return `${now.getFullYear()}-${m < 10 ? '0' + m : m}`;
    });

    const [attendanceDates, setAttendanceDates] = useState([]);
    const [isQuestModalVisible, setIsQuestModalVisible] = useState(false);
    const [selectedQuestId, setSelectedQuestId] = useState<string | number>();

    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    useEffect(() => {
        const fetchData = async () => {
            console.log("현재 보여지는 달:", currentYearMonth);
            const response = await getBehaviorsSummary(currentYearMonth);
            setAttendanceDates(response);
            setAttendance(response.length);
        };

        fetchData();
    }, [currentYearMonth]);

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

    const selectIcon = (type: string) => {
        if (type === "QUEST") {
            return require("../assets/Images/quest_icon.png");
        } else if (type === "TOPIC") {
            return require("../assets/Images/topic_icon.png");
        }
        else if (type === "DIARY") {
            return require("../assets/Images/diary_icon.png");
        }
        else if (type === "DIAGNOSIS") {
            return require("../assets/Images/diagnosis_icon.png");
        }
        // else {
        //     return require("../assets/Images/default_icon.png"); 
        // }
    };

    const handlePressBehavior = (behavior: Behavior) => {
        console.log("Behavior clicked:", behavior);
        switch (behavior.type.toUpperCase()) {
            case "DIAGNOSIS":
                console.log("퀘스트 모달 열림");
                setSelectedQuestId(behavior.id)
                setIsQuestModalVisible(true); // 모달 열기
                break;
            case "TOPIC":
                navigation.navigate("DailyTopic", { date: selectedDate });
                break;
            case "QUEST":

                // 
                break;
                setSelectedQuestId(behavior.id);
            case "DIARY":
                navigation.navigate("Record", { date: selectedDate });
                break;
            default:
                console.warn("Unknown behavior type:", behavior.type);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getBehaviors(selectedDate);
                console.log("fetchData", response);
                setBehaviors(response);
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
            }
        };

        fetchData();
    }, [selectedDate]);
    useEffect(() => {
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const daysInMonth = new Date(year, month, 0).getDate();
        setAttendanceRate(attendance / daysInMonth);
    }, [attendance, selectedDate]);

    useSecondPasswordGuard("Calendar");
    useEffect(() => {
        AsyncStorage.setItem("contentPasswordPassed", "false");
    }, []);

    return (
        <View style={calendarStyles.container}>
            <View style={calendarStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Home", {})}
                    style={calendarStyles.backButtonWrapper}
                >
                    <Ionicons name="arrow-back-circle" size={40} color="#fff" />
                </TouchableOpacity>
                <Text style={calendarStyles.title}>달력</Text>
            </View>
            <Calendar
                current={selectedDate}
                onDayPress={(day: { dateString: SetStateAction<string>; }) => setSelectedDate(day.dateString)}
                onMonthChange={(month) => {
                    const m = month.month < 10 ? '0' + month.month : month.month;
                    setCurrentYearMonth(`${month.year}-${m}`);
                }}
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
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 20 }}
                    style={{ flexGrow: 1, maxHeight: 400 }}
                    showsVerticalScrollIndicator={false}
                >
                    {behaviors.length > 0 ? (
                        behaviors.map((item, index) => (
                            <View key={index}>
                                <TouchableOpacity onPress={() => handlePressBehavior(item)}>
                                    <View style={calendarStyles.taskItem}>
                                        <Image
                                            source={selectIcon(item.type)}
                                            style={calendarStyles.icon}
                                        />
                                        <View>
                                            <Text style={calendarStyles.taskTitle}>{item.title}</Text>
                                            <Text style={calendarStyles.taskSubtitle}>{item.content}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {index !== behaviors.length - 1 && <View style={calendarStyles.divider} />}
                            </View>
                        ))
                    ) : (
                        <View style={calendarStyles.emptyContainer}>
                            <Text style={calendarStyles.emptyText}>이 날에는 기록된 활동이 없어요.</Text>
                        </View>
                    )}

                </ScrollView>

            </View>
            <DepressionResultModal
                visible={isQuestModalVisible}
                onClose={() => setIsQuestModalVisible(false)}
                id={selectedQuestId ?? ""}
            />
        </View>
    );
}

function formatDate(dateString: string) {
    const [year, month, day] = dateString.split('-');
    return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}