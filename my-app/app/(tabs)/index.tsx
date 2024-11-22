import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { router } from 'expo-router';
import {Api} from "../api"
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function LoginScreen() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleLogin = async () => {
        setErrorMessage(''); // Reset thông báo lỗi
    
        try {
            const response = await fetch(`${Api}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
    
            const data = await response.json();
    
            if (response.status === 200) {
                console.log('Login successful:', data);
                // Lưu token vào AsyncStorage
                await AsyncStorage.setItem("jwt_token", data.token); 
                await AsyncStorage.setItem("user_id", data.user.id.toString());// Lưu token từ phản hồi API
                router.push('/home');
            } else {
                setErrorMessage("Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại email và mật khẩu.");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            setErrorMessage("Không thể kết nối. Vui lòng thử lại sau.");
        }
    };
    

    const handleRegisterPress = () => {
        router.push('/register');
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.logoapp}
                source={require('@/assets/images/logo-oficial-store.png')}
            />
            <ThemedView style={styles.text}>
                <ThemedText type="title">Login</ThemedText>
            </ThemedView>

            {/* Hiển thị thông báo lỗi nếu có */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

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
            <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="white" />
                <Text style={styles.socialButtonText}>Log in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                <Ionicons name="logo-facebook" size={24} color="white" />
                <Text style={styles.socialButtonText}>Log in with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegisterPress}>
                <Text style={styles.textRegister}>Sign up for an account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF', // Nền trắng
    },
    text: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Nền trắng
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333', // Màu chữ tối để dễ đọc trên nền sáng
        backgroundColor: '#f8f8f8', // Nền input xám nhạt
    },
    loginButton: {
        backgroundColor: '#FF6347', // Đổi màu cam để nổi bật trên nền trắng
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    forgotPasswordText: {
        color: '#FF6347', // Đổi sang màu cam cho liên kết
        fontSize: 16,
        textAlign: 'right',
        marginRight: 10,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#db4437',
        padding: 15,
        borderRadius: 10,
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
    },
    logoapp: {
        width: 350,
        height: 200,
        resizeMode: 'contain',
        marginTop: 0,
        marginBottom: 20,
    },
    textRegister: {
        color: '#FF6347', // Đổi màu cam cho liên kết
        textAlign: 'center',
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

