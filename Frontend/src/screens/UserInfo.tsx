import React, {useEffect, useState} from "react";
import {Alert, Dimensions, Image, Modal, Text, TextInput, TouchableOpacity, View} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "../API/signAPI";
import {GenderEnum, getUserInfo, putProfileImg, userInfoUpdate} from "../API/userInfoAPI";
import userInfoStyles from "../styles/userInfoStyles";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Ionicons} from "@expo/vector-icons";

const cloverProfile = require("../assets/Images/cloverProfile.png");

// 화면 너비와 높이 가져오기
const { width, height } = Dimensions.get("window");

type UserData = {
  nickname: string;
  email: string;
  password: string | null;
  birthDate: string;
  gender: string;
  secondPassword: number;
  profilePic: string | null;
};

export default function UserInfo() {
  const [userData, setUserData] = useState<UserData>({
    nickname: "홍길동",
    email: "hong@example.com",
    password: "password123",
    birthDate: "1990-01-01",
    gender: "남성",
    secondPassword: 1234,
    profilePic: null,
  });

  const [editMode, setEditMode] = useState(false);
  const [originalData, setOriginalData] = useState<UserData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const getGenderLabel = (gender: GenderEnum | string | null | undefined): string => {
    switch (gender) {
      case GenderEnum.MALE:
      case "MALE":
      case GenderEnum.MALE:
        return "남성";
      case GenderEnum.FEMALE:
      case "FEMALE":
      case GenderEnum.FEMALE:
        return "여성";
      case "THIRD_GENDER":
      case GenderEnum.THIRD_GENDER:
        return "제 3의 성"
      default:
        return "밝히지 않음"
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserInfo();
      console.log("User Info:", response);

      const user = response;

      const initialData: UserData = {
        nickname: user.username,
        email: user.email,
        password: "",
        birthDate: user.birthDate,
        gender: getGenderLabel(user.gender),
        secondPassword: Number(await AsyncStorage.getItem("@secondPassword")) || 1111,
        profilePic: user.profile ?? null,
      };

      setUserData(initialData);
      setOriginalData(initialData);

      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
    };

    fetchData();
  }, []);


  useEffect(() => {
    const storeSecondPassword = async () => {
      try {
        if (originalData?.secondPassword !== userData.secondPassword) {
          await AsyncStorage.setItem("@secondPassword", userData.secondPassword.toString());
          console.log("2차 비밀번호가 변경되었습니다.");
        }
      } catch (error) {
        console.error("2차 비밀번호 저장 실패:", error);
      }
    };

    storeSecondPassword();
  }, [userData.secondPassword]);


  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);
      if (accessToken && refreshToken) {
        await signOut(accessToken, refreshToken);
      }
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      Alert.alert("로그아웃 완료", "성공적으로 로그아웃되었습니다.");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "SimpleDiagnosis" }],
        })
      )
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("로그아웃 실패", "다시 시도해주세요.");
    }
  };


  const handleSave = async () => {
    const hasChanges = JSON.stringify(userData) !== JSON.stringify(originalData);
    if (!hasChanges) return;

    let gender: GenderEnum = GenderEnum.UNKNOWN

    switch(userData.gender) {
      case GenderEnum.MALE:
        gender = GenderEnum.MALE;
        break;
      case GenderEnum.FEMALE:
        gender = GenderEnum.FEMALE;
        break;
      case GenderEnum.THIRD_GENDER:
        gender = GenderEnum.THIRD_GENDER;
        break;
    }

    try {
      const transformedUserData = {
        ...userData,
        gender
      };

      // 기본 정보 업데이트
      const result = await userInfoUpdate(
        transformedUserData.password,
        transformedUserData.nickname,
        transformedUserData.birthDate,
        transformedUserData.gender,
      );

      // 프로필 이미지가 있을 경우에만 전송
      if (userData.profilePic) {
        const fileUri = userData.profilePic;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          const profileImage = {
            uri: fileInfo.uri,
            name: "profile.jpg",
            type: "image/jpeg",
          };
          await putProfileImg(profileImage);
        } else {
          throw new Error("파일을 찾을 수 없습니다");
        }
      }

      // 저장 성공 후 처리
      Alert.alert("저장 완료", "회원 정보가 수정되었습니다.");
      setOriginalData(userData);
      setEditMode(false);
      setHasChanges(false);
    } catch (error) {
      console.error("회원정보 업데이트 실패:", error);
      Alert.alert("저장 실패", "정보 수정 중 문제가 발생했습니다.");
    }
  };



  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setUserData({
        ...userData,
        profilePic: result.assets[0].uri,
      });
      setHasChanges(true);
    }
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setUserData({
        ...userData,
        profilePic: result.assets[0].uri,
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
      <Image source={{ uri: userData.profilePic }} style={userInfoStyles.avatar} />
    ) : (
      <Image source={cloverProfile} style={userInfoStyles.avatar} />
    );
  };

  return (

    <View style={[userInfoStyles.container, { position: "relative" }]}>
      <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={userInfoStyles.backButton}
        >

          <Ionicons name="arrow-back-circle" size={40} color="#fff" />
        </TouchableOpacity>
      <Text style={userInfoStyles.header}>My Profile</Text>
      <View style={userInfoStyles.whiteBox}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {renderProfilePic()}
        </TouchableOpacity>

        <Text style={userInfoStyles.nickname}>{userData.nickname}</Text>

        <InfoRow label="이메일" value={userData.email} editable={false} />

        <InfoRow
          label="비밀번호"
          value={userData.password ?? ""}
          onChangeText={(text) => setUserData({ ...userData, password: text })}
          secureTextEntry={!editMode}
          editable={editMode}
        />

        <InfoRow label="생년월일" value={userData.birthDate} editable={false} />

        <View style={userInfoStyles.row}>
          <Text style={userInfoStyles.label}>성별</Text>
          {editMode ? (
            <View style={userInfoStyles.genderOptions}>
              {["여성", "남성", "비밀"].map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setUserData({ ...userData, gender: g })}
                  style={[
                    userInfoStyles.genderButton,
                    userData.gender === g && userInfoStyles.genderSelected,
                  ]}
                >
                  <Text style={userInfoStyles.buttonText}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={userInfoStyles.buttonText}>{userData.gender}</Text>
          )}
        </View>

        <InfoRow
          label="2차 비밀번호"
          value={userData.secondPassword.toString()}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '').slice(0, 4);
            setUserData({ ...userData, secondPassword: Number(numericText) });
          }}
          secureTextEntry={!editMode}
          editable={editMode}
          keyboardType="number-pad"
          maxLength={4}
        />


        <View style={userInfoStyles.buttonRow}>
          <TouchableOpacity
            style={userInfoStyles.cancelButton}
            onPress={() => {
              setUserData(originalData as UserData);
              setEditMode(false);
              setHasChanges(false);
            }}
          >
            <Text style={userInfoStyles.buttonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={userInfoStyles.editButton}
            onPress={() => {
              if (editMode) {
                handleSave();
              } else {
                setEditMode(true);
              }
            }}
          >
            <Text style={userInfoStyles.buttonText}>{editMode ? "저장" : "수정"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={userInfoStyles.logOutButton}
            onPress={() => handleLogout()}
          >
            <Text style={userInfoStyles.buttonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={userInfoStyles.modalContainer}>
          <View style={userInfoStyles.modalContent}>
            {editMode ? (
              <>
                <TouchableOpacity onPress={handlePickImage} style={userInfoStyles.button}>
                  <Text style={userInfoStyles.buttonText}>갤러리에서 선택</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTakePhoto} style={userInfoStyles.button}>
                  <Text style={userInfoStyles.buttonText}>카메라로 찍기</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleResetProfilePic} style={userInfoStyles.button}>
                  <Text style={userInfoStyles.buttonText}>기본 이미지로 설정</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={userInfoStyles.buttonText}>수정 모드에서만 변경 가능합니다.</Text>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={userInfoStyles.button}>
              <Text style={userInfoStyles.buttonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "number-pad" | "numeric" | "email-address" | "phone-pad";
  maxLength?: number;
};


function InfoRow({
  label,
  value,
  onChangeText,
  editable = true,
  secureTextEntry = false,
  keyboardType = "default",
  maxLength = 20,
}: InfoRowProps) {
  return (
    <View style={userInfoStyles.row}>
      <Text style={userInfoStyles.label}>{label}</Text>
      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={userInfoStyles.input}
          secureTextEntry={secureTextEntry}
          editable={editable}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />

      ) : (
        <Text style={userInfoStyles.Text}>{secureTextEntry ? "●●●●" : value}</Text>
      )}
    </View>
  );
}

