  import React, { useEffect, useState } from 'react';
  import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
  import { Ionicons } from '@expo/vector-icons';
  import axios from 'axios';
  import { useNavigation } from '@react-navigation/native';
  import { StackNavigationProp } from '@react-navigation/stack';
  import Checkbox from 'expo-checkbox';
  import {Api} from "./api"
  import {ip} from "./api"
  import AsyncStorage from '@react-native-async-storage/async-storage';
  interface CartItem {
    id: string;
    product_id: string;
    name: string;
    photo: string;
    price: number;
    quantity: number;
  }

  interface Product {
    id: string;
    name: string;
    photo: string;
    price: number;
  }

  interface CheckoutParams {
    total: number;
    selectedItems: CartItem[];
  }

  type RootStackParamList = {
    Checkout: CheckoutParams;
  };


  const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
    const navigation = useNavigation();

    useEffect(() => {
      const fetchCartItems = async () => {
        try {
          const token = await AsyncStorage.getItem('jwt_token'); 
                  const response = await axios.get(`${Api}/product/cart-list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Cart Items:', response.data); // Kiểm tra dữ liệu trả về
          setCartItems(response.data);
        } catch (error) {
          console.error('Error fetching cart items:', error);
          Alert.alert('An error occurred while loading the cart.');
        }
      };

      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${Api}/products`);
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching product list:', error);
          Alert.alert('An error occurred while loading the product list.');
        }
      };

      fetchCartItems();
      fetchProducts();
    }, []);

    const handleRemoveItem = async (itemId: string) => {
      try {
        const token = await AsyncStorage.getItem('jwt_token'); 
        await axios.delete(`${Api}/product/cart-list/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItems(cartItems.filter(item => item.id !== itemId));
        Alert.alert('Product has been removed from the cart.');
      } catch (error) {
        console.error('Error removing product from cart:', error);
        Alert.alert('An error occurred while removing the product.');
      }
    };

    const calculateTotal = () => {
      return cartItems.reduce((total, item) => {
        if (selectedItems[item.id]) {
          return total + (item.price * item.quantity);
        }
        return total;
      }, 0);
    };

    const handleCheckout = async () => {
      // Calculate total amount
      const total = calculateTotal();
      
      // Filter selected cart items
      const selectedCartItems = cartItems
        .filter(item => selectedItems[item.id])
        .map(item => ({
          id: item.id,
          product_id: item.product_id,
          name: item.name,
          photo: item.photo,
          price: item.price,
          quantity: item.quantity,
        }));
      
      // Check if any items are selected
      if (selectedCartItems.length === 0) {
        Alert.alert('Vui lòng chọn ít nhất một sản phẩm để tiếp tục thanh toán.');
        return;
      }
      
      try {
        // Save selected items to AsyncStorage if needed
        await AsyncStorage.setItem('selectedCartItems', JSON.stringify(selectedCartItems));
    
        // Navigate to Checkout screen with total and selected items
        navigation.navigate('Checkout', { total, selectedItems: JSON.stringify(selectedCartItems) }); // Serialize selectedItems
      } catch (error) {
        console.error('Error saving selected items:', error);
        Alert.alert('Đã xảy ra lỗi khi lưu sản phẩm trong giỏ hàng.');
      }
    };
    
    
    const filteredProducts = products.filter(product =>
      cartItems.some(cartItem => cartItem.product_id === product.id)
    );

    const renderCartItem = ({ item }: { item: Product }) => {
      const cartItem = cartItems.find(cart => cart.product_id === item.id);
      return (
        <View style={styles.cartItem}>
          <TouchableOpacity style={styles.cartItemContent}>
            <Image 
              source={{ uri: `${ip}/storage/products/${item.photo}` }} 
              style={styles.productImage} 
            />
            <View style={styles.productDetails}>
              <TouchableOpacity>
                <Text style={styles.productName}>{item.name}</Text>
              </TouchableOpacity>
              <Text style={styles.productPrice}>{(cartItem?.price || 0).toLocaleString()} $</Text>
              <Text style={styles.productQuantity}>Quantity: {cartItem?.quantity}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRemoveItem(cartItem?.id || '')}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
          <Checkbox
            value={selectedItems[cartItem?.id || ''] || false}
            onValueChange={() => {
              setSelectedItems(prev => {
                const updatedSelectedItems = { ...prev, [cartItem?.id || '']: !prev[cartItem?.id || ''] };
                return updatedSelectedItems;
              });
            }}
          />
        </View>
      );
    };

    const totalAmount = calculateTotal();

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Cart</Text>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderCartItem}
        />
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Amount: {totalAmount.toLocaleString()} $</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout Selected</Text>
          </TouchableOpacity>
        </View>
        
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
    cartItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 15,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    cartItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: 5,
      marginRight: 15,
    },
    productDetails: {
      flex: 1,
      paddingVertical: 5,
    },
    productName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
    },
    productPrice: {
      fontSize: 16,
      color: '#28A745',
      marginTop: 5,
    },
    productQuantity: {
      fontSize: 14,
      color: '#555',
      marginTop: 3,
    },
    totalContainer: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    totalText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 10,
    },
    checkoutButton: {
      backgroundColor: '#28A745',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    checkoutButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  export default Cart;
