import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { launchCamera, launchImageLibrary, ImagePickerResponse } from "react-native-image-picker";

// 이미지 경로 수정: require 방식으로 이미지 가져오기
const cloverProfile = require("../assets/Images/cloverProfile.png");

type UserData = {
  nickname: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
  secondPassword: string;
  profilePic: string | null;  // profilePic은 string | null 타입으로 유지
};

export default function UserInfo() {
  const [userData, setUserData] = useState<UserData>({
    nickname: "홍길동",
    email: "hong@example.com",
    password: "password123",
    birthDate: "1990-01-01",
    gender: "남성",
    secondPassword: "second123",
    profilePic: null, // 기본값은 null
  });

  const [editMode, setEditMode] = useState(false);
  const [originalData, setOriginalData] = useState<UserData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const initialData: UserData = {
        nickname: "홍길동",
        email: "hong@example.com",
        password: "password123",
        birthDate: "1990-01-01",
        gender: "남성",
        secondPassword: "second123",
        profilePic: null, // 기본 프로필 이미지 설정을 null로
      };
      setUserData(initialData);
      setOriginalData(initialData);
    };
    fetchData();
  }, []);

  const handleSave = () => {
    const hasChanges = JSON.stringify(userData) !== JSON.stringify(originalData);
    if (!hasChanges) return;

    const updatedUserData: UserData = { ...userData };
    Alert.alert("저장 완료", "회원 정보가 수정되었습니다.");
    console.log(updatedUserData);
    setOriginalData(userData);
    setEditMode(false);
    setHasChanges(false);
  };

  const handlePickImage = () => {
    const options = {
      mediaType: 'photo' as const,  // 'photo'로 타입 지정
      includeBase64: false,
    };
  
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setUserData({
          ...userData,
          profilePic: imageUri ?? null, // uri가 없을 경우 null 처리
        });
        setHasChanges(true);
      }
    });
  };
  
  const handleTakePhoto = () => {
    const options = {
      mediaType: 'photo' as const,  // 'photo'로 타입 지정
      includeBase64: false,
    };
  
    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setUserData({
          ...userData,
          profilePic: imageUri ?? null, // uri가 없을 경우 null 처리
        });
        setHasChanges(true);
      }
    });
  };
  
  const renderProfilePic = () => {
    return userData.profilePic ? (
      <Image source={{ uri: userData.profilePic }} style={styles.avatar} />
    ) : (
      <Image source={cloverProfile} style={styles.avatar} />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>
      <View style={styles.whiteBox}>
        {renderProfilePic()}
        <TouchableOpacity onPress={handlePickImage} style={styles.button}>
          <Text>사진 갤러리에서 선택</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
          <Text>카메라로 찍기</Text>
        </TouchableOpacity>
      </View>

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
          onPress={() => {
            setUserData(originalData as UserData);
            setEditMode(false);
            setHasChanges(false);
          }}
        >
          <Text>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (editMode) {
              handleSave();
            } else {
              setEditMode(true);
            }
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
  whiteBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { color: "#fff", textAlign: "center" },
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
  button: {
    padding: 10,
    backgroundColor: "#ffb74d",
    borderRadius: 5,
    marginBottom: 10,
  },
});