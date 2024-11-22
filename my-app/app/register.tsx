import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { router } from 'expo-router';
import {Api} from "./api"
export default function RegisterScreen() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);

    const handleRegister = async () => {
        setErrorMessage('');

        if (password !== confirmPassword) {
            setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        try {
            const response = await fetch(`${Api}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    password_confirmation: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.status === 201) {
                setModalVisible(true);
            } else if (response.status === 409) {
                setErrorMessage("Email này đã được sử dụng!");
            } else {
              setErrorMessage("Email này đã được sử dụng!");
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            setErrorMessage("Không thể kết nối. Vui lòng thử lại sau.");
        }
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.logoapp}
                source={require('@/assets/images/logo-oficial-store.png')}
            />
            <ThemedView style={styles.text}>
                <ThemedText type="title">Register</ThemedText>
            </ThemedView>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            <Text style={styles.abc}>----OR----</Text>

            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="white" />
                <Text style={styles.socialButtonText}>Log in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                <Ionicons name="logo-facebook" size={24} color="white" />
                <Text style={styles.socialButtonText}>Log in with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/')}>
                <Text style={styles.textLogin}>Back to login page.</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Registration successful!</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    router.push('/');
                                }}
                            >
                                <Text style={styles.modalButtonText}>Back to login page</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Nền trắng
        padding: 20,
    },
    text: {
        marginVertical: 10,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc', // Đổi màu viền nhạt hơn
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333', // Màu chữ đậm hơn để dễ đọc trên nền trắng
        backgroundColor: '#f8f8f8', // Nền input xám nhạt
    },
    loginButton: {
        backgroundColor: '#FF6347', // Giữ màu cam để nổi bật trên nền trắng
        padding: 15,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 25,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#db4437',
        padding: 12,
        borderRadius: 12,
        width: '100%',
        justifyContent: 'center',
        marginBottom: 10,
    },
    facebookButton: {
        backgroundColor: '#4267B2',
    },
    socialButtonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '600',
    },
    errorText: {
        color: '#FF6347',
        marginBottom: 10,
        textAlign: 'center',
    },
    logoapp: {
        width: 250,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    abc: {
        color: '#333',
        fontSize: 15,
        textAlign: 'center',
    },
    textLogin: {
        color: '#FF6347', // Màu cam cho liên kết
        textAlign: 'center',
        marginVertical: 15,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ tối cho modal
    },
    modalView: {
        width: '85%',
        backgroundColor: '#FFFFFF', // Nền trắng cho ô cửa sổ modal
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        elevation: 10,
    },
    modalText: {
        color: '#333',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#FF6347',
        padding: 12,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
});


