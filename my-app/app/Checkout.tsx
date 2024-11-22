import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { Api } from './api';

interface RouteParams {
    params: {
        total: number;
        selectedItems: string; // Chúng ta sẽ nhận một chuỗi JSON từ Cart
    };
}

const Checkout = ({ route }: { route?: RouteParams }) => {
    const total = route?.params?.total ?? 0;
    const selectedItems = route?.params?.selectedItems ? JSON.parse(route.params.selectedItems) : []; // Phân tích chuỗi JSON thành mảng

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [provinces, setProvinces] = useState('');
    const [district, setDistrict] = useState('');
    const [wards, setWards] = useState('');
    const [address, setAddress] = useState('');

    const handleOrder = async () => {
        // Kiểm tra các trường nhập liệu
        if (!name || !phone || !email || !address || !district || !provinces || !wards) {
            Alert.alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Nếu không có sản phẩm đã chọn, thêm sản phẩm mặc định
        const items = selectedItems.length > 0 ? selectedItems : [{ name: 'Sản phẩm mặc định', quantity: 1 }];

        const orderData = {
            customer: {
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                provinces: provinces.trim(),
                district: district.trim(),
                wards: wards.trim(),
                address: address.trim(),
            },
            products: items,
            totalMoney: total > 0 ? total : 1,
        };

        console.log('Dữ liệu đơn hàng:', orderData);

        try {
            // Get the token
            const token = await AsyncStorage.getItem('jwt_token');

            const response = await axios.post(`${Api}/abate`, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in the headers
                },
            });
            
            console.log('Phản hồi đơn hàng:', response.data);
            Alert.alert('Đặt hàng thành công!', `ID đơn hàng: ${response.data.id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Lỗi khi đặt hàng:', error.response?.data || error.message);
            } else {
                console.error('Lỗi không xác định:', error);
            }
            Alert.alert('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.');
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment</Text>
            <TextInput placeholder="Họ tên" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Điện thoại" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
            <TextInput placeholder="Tỉnh/Thành phố" value={provinces} onChangeText={setProvinces} style={styles.input} />
            <TextInput placeholder="Quận/Huyện" value={district} onChangeText={setDistrict} style={styles.input} />
            <TextInput placeholder="Phường/Xã" value={wards} onChangeText={setWards} style={styles.input} />
            <TextInput placeholder="Địa chỉ" value={address} onChangeText={setAddress} style={styles.input} />
            <Text style={styles.totalText}>Total: {total.toLocaleString()} $</Text>
            <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
                <Text style={styles.orderButtonText}>Order</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: 10,
    },
    orderButton: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Checkout;
