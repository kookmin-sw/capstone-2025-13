import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import styles from "../styles/topicModalStyles";

interface ModalComponentProps {
    visible: boolean;
    onClose: () => void;
    onGoToDiary: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ visible, onClose, onGoToDiary }) => {

    return (
        <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>오늘은 여기까지!</Text>
                    <Text style={styles.modalSubText}>
                        오늘 세잎이와 대화는 종료되었어요!
                        {"\n"}오늘 대화를 기반으로 일기를 써보는 건 어떄요?
                        {"\n"}내일 세잎이랑 다시 만나요! ☘️
                    </Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.closeButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.modalButtonText}>닫기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.diaryButton]}
                            onPress={onGoToDiary}
                        >
                            <Text style={styles.modalButtonText}>일기로 이동</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalComponent;
