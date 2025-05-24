// components/ProfileImageModal.tsx
import React from "react";
import { Modal, View, TouchableOpacity, Text } from "react-native";
import userInfoStyles from "../../styles/UserInfo/userInfoStyles";

type ProfileImageModalProps = {
    visible: boolean;
    onClose: () => void;
    onPickImage: () => void;
    onTakePhoto: () => void;
    onReset: () => void;
    editMode: boolean;
};

export default function ProfileImageModal({
    visible,
    onClose,
    onPickImage,
    onTakePhoto,
    onReset,
    editMode,
}: ProfileImageModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={userInfoStyles.modalContainer}>
                <View style={userInfoStyles.modalContent}>
                    {editMode ? (
                        <>
                            <TouchableOpacity onPress={onPickImage} style={userInfoStyles.button}>
                                <Text style={userInfoStyles.buttonText}>갤러리에서 선택</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onTakePhoto} style={userInfoStyles.button}>
                                <Text style={userInfoStyles.buttonText}>카메라로 찍기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onReset} style={userInfoStyles.button}>
                                <Text style={userInfoStyles.buttonText}>기본 이미지로 설정</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={userInfoStyles.buttonText}>수정 모드에서만 변경 가능합니다.</Text>
                    )}
                    <TouchableOpacity onPress={onClose} style={userInfoStyles.button}>
                        <Text style={userInfoStyles.buttonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
