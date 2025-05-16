// components/TermsModal.tsx
import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

interface TermsModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

const TermsModal: React.FC<TermsModalProps> = ({ visible, onClose, title, content }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.modalContent}>{content}</Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#F9FAEC",
        width: "90%",
        borderRadius: 40,
        padding: 20,
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    scrollView: {
        marginBottom: 20,
    },
    modalContent: {
        fontSize: 14,
        lineHeight: 20,
    },
    closeButton: {
        alignSelf: "flex-end",
        paddingVertical: 6,
        paddingHorizontal: 16,
        backgroundColor: "#4FA55C",
        borderRadius: 5,
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default TermsModal;
