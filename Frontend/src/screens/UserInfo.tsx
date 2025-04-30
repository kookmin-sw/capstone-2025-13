import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

type UserData = {
  nickname: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
  secondPassword: string;
};

export default function UserInfo() {
  const [userData, setUserData] = useState<UserData>({
    nickname: "",
    email: "",
    password: "",
    birthDate: "",
    gender: "",
    secondPassword: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [originalData, setOriginalData] = useState<UserData | null>(null);

  // 가정된 사용자 정보 (API 호출 부분 생략)
  useEffect(() => {
    const fetchData = async () => {
      // 이 부분에서는 실제 API 호출을 하지 않고 로컬에서 초기 데이터를 가정합니다.
      const initialData: UserData = {
        nickname: "홍길동",
        email: "hong@example.com",
        password: "password123",
        birthDate: "1990-01-01",
        gender: "남성",
        secondPassword: "second123",
      };
      setUserData(initialData);
      setOriginalData(initialData);
    };
    fetchData();
  }, []);

  const handleSave = () => {
    const hasChanges = JSON.stringify(userData) !== JSON.stringify(originalData);
    if (!hasChanges) return;

    // 수정된 데이터가 하나의 JSON 객체로 생성됩니다.
    const updatedUserData: UserData = { ...userData };
    Alert.alert("저장 완료", "회원 정보가 수정되었습니다.");
    console.log(updatedUserData); // 여기서 JSON 객체 확인
    setOriginalData(userData);
    setEditMode(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>
      <Image style={styles.avatar} />
      <Text style={styles.nickname}>{userData.nickname}</Text>

      <InfoRow label="이메일" value={userData.email} editable={false} />
      <InfoRow
        label="비밀번호"
        value={userData.password}
        onChangeText={(text) => setUserData({ ...userData, password: text })}
        secureTextEntry
        editable={editMode}
      />
      <InfoRow label="생년월일" value={userData.birthDate} editable={false} />

      <View style={styles.row}>
        <Text style={styles.label}>성별</Text>
        {editMode ? (
          <View style={styles.genderOptions}>
            {["여성", "남성", "비밀"].map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setUserData({ ...userData, gender: g })}
                style={[
                  styles.genderButton,
                  userData.gender === g && styles.genderSelected,
                ]}
              >
                <Text>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text>{userData.gender}</Text>
        )}
      </View>

      <InfoRow
        label="2차 비밀번호"
        value={userData.secondPassword}
        onChangeText={(text) => setUserData({ ...userData, secondPassword: text })}
        secureTextEntry
        editable={editMode}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {}}
        >
          <Text>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (editMode) handleSave();
            else setEditMode(true);
          }}
        >
          <Text>{editMode ? "저장" : "수정"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  secureTextEntry?: boolean;
};

function InfoRow({
  label,
  value,
  onChangeText,
  editable = true,
  secureTextEntry = false,
}: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          secureTextEntry={secureTextEntry}
        />
      ) : (
        <Text>{secureTextEntry ? "●●●●●●" : value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#4CAF50" },
  header: {
    fontSize: 28,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  nickname: { fontSize: 20, textAlign: "center", marginBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  label: { width: 100 },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 4,
  },
  genderOptions: { flexDirection: "row", gap: 10 },
  genderButton: {
    padding: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  genderSelected: { backgroundColor: "#ffdb99" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#fbe9e7",
    borderRadius: 10,
  },
  editButton: {
    padding: 10,
    backgroundColor: "#ffb74d",
    borderRadius: 10,
  },
});
