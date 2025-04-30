import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Modal } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const cloverProfile = require("../assets/Images/cloverProfile.png");

type UserData = {
  nickname: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
  secondPassword: string;
  profilePic: string | null;
};

export default function UserInfo() {
  const [userData, setUserData] = useState<UserData>({
    nickname: "홍길동",
    email: "hong@example.com",
    password: "password123",
    birthDate: "1990-01-01",
    gender: "남성",
    secondPassword: "second123",
    profilePic: null,
  });

  const [editMode, setEditMode] = useState(false);
  const [originalData, setOriginalData] = useState<UserData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const initialData: UserData = {
        nickname: "홍길동",
        email: "hong@example.com",
        password: "password123",
        birthDate: "1990-01-01",
        gender: "남성",
        secondPassword: "second123",
        profilePic: null,
      };
      setUserData(initialData);
      setOriginalData(initialData);

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

      if (galleryStatus.granted) {
        console.log("갤러리 권한이 허용되었습니다.");
      }
      if (cameraStatus.granted) {
        console.log("카메라 권한이 허용되었습니다.");
      }
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

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("권한이 필요합니다", "갤러리 접근 권한을 허용해주세요.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) { // `canceled` 확인 및 assets 배열에 값이 있는지 확인
      setUserData({
        ...userData,
        profilePic: result.assets[0].uri, // 첫 번째 이미지의 URI
      });
      setHasChanges(true);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("권한이 필요합니다", "카메라 접근 권한을 허용해주세요.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) { // `canceled` 확인 및 assets 배열에 값이 있는지 확인
      setUserData({
        ...userData,
        profilePic: result.assets[0].uri, // 첫 번째 이미지의 URI
      });
      setHasChanges(true);
    }
  };

  const handleResetProfilePic = () => {
    setUserData({
      ...userData,
      profilePic: null,
    });
    setHasChanges(true);
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
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {renderProfilePic()}
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handlePickImage} style={styles.button}>
                <Text>갤러리에서 선택</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
                <Text>카메라로 찍기</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleResetProfilePic} style={styles.button}>
                <Text>기본 이미지로 설정</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
                <Text>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    marginBottom: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nickname: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  label: { fontSize: 16, color: "#333" },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: 200,
    padding: 5,
    fontSize: 16,
  },
  genderOptions: { flexDirection: "row" },
  genderButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
  },
  genderSelected: {
    backgroundColor: "#4CAF50",
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  button: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
});
