// ... các import khác
import React, { ReactNode, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {ip} from "./api"
const { width } = Dimensions.get('window');

// Định nghĩa kiểu cho sản phẩm và các tham số truyền vào màn hình chi tiết sản phẩm
type Product = {
  description: ReactNode;
  name: string;
  price: string;
  photo: any;  
};

type ProductDetailScreenRouteProp = RouteProp<{ params: { product: Product } }, 'params'>;

// Định nghĩa kiểu cho sản phẩm liên quan
type RelatedProduct = {
  id: string;
  name: string;
  price: string;
  image: any;  
  description: string;
};

const relatedProducts: RelatedProduct[] = [
  { 
    id: '1', 
    name: 'Youth Hoodie ', 
    price: '99 $', 
    image: require('@/assets/images/products/aoreal07.png'),
    description: 'Designed for young fans, dress the little champions in the spirit of Real Madrid with this green youth t-shirt. Whether it’s for school, matchday, or a day at the park, this t-shirt offers both comfort and style for Madridista kids who want to proudly support their team.' 
  },

  { 
    id: '2', 
    name: 'T-Shirt Fan Kids', 
    price: '99 $', 
    image: require('@/assets/images/products/aoreal08.png'),
    description: 'Designed for young fans, dress the little champions in the spirit of Real Madrid with this green youth t-shirt. Whether it’s for school, matchday, or a day at the park, this t-shirt offers both comfort and style for Madridista kids who want to proudly support their team.' 
  },
  { 
    id: '3', 
    name: 'Ombre Green', 
    price: '60 $', 
    image: require('@/assets/images/products/aoreal09.png'),
    description: 'Designed for young fans, dress the little champions in the spirit of Real Madrid with this green youth t-shirt. Whether it’s for school, matchday, or a day at the park, this t-shirt offers both comfort and style for Madridista kids who want to proudly support their team.' 
  },
  { 
    id: '4', 
    name: ' Kids Ombre Green ', 
    price: '90 $', 
    image: require('@/assets/images/products/aoreal10.png'),
    description: 'Designed for young fans, dress the little champions in the spirit of Real Madrid with this green youth t-shirt. Whether it’s for school, matchday, or a day at the park, this t-shirt offers both comfort and style for Madridista kids who want to proudly support their team.' 
  },
];

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { product } = route.params;  

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const renderRelatedProduct = ({ item }: { item: RelatedProduct }) => (
    <TouchableOpacity style={styles.relatedProductContainer} >
      <Image source={item.image} style={styles.relatedProductImage}/>
      <Text style={styles.relatedProductName}>{item.name}</Text>
      <Text style={styles.relatedProductPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  const handleRegisterPress = () => {
    router.push('/home');
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={handleRegisterPress}>
        <Ionicons name="arrow-back" size={35} color="black" />
      </TouchableOpacity>
      <Image style={styles.productImage} source={{ uri: `${ip}/storage/products/${product.photo}` }} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{product.price} $</Text>

      <View style={styles.quantitySelector}>
        <TouchableOpacity style={styles.button} onPress={decreaseQuantity}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity style={styles.button} onPress={increaseQuantity}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Bọc hai nút Order và Payment trong một View có flexDirection: 'row' */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Payment</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.descriptionTitle}>Description:</Text>
      <Text style={styles.descriptionText}>{product.description}</Text>
      <Text style={styles.relatedProductsTitle}>Related Products</Text>
      <FlatList
        data={relatedProducts}
        renderItem={renderRelatedProduct}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: width - 40,
    height: 250,
    borderRadius: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: '#333',
  },
  productPrice: {
    fontSize: 20,
    color: '#E63946',
    textAlign: 'center',
    marginBottom: 15,
  },
  quantitySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  quantityText: {
    width: 60,
    textAlign: 'center',
    fontSize: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  button: {
    width: 40,
    alignItems: 'center',
    backgroundColor: '#C0C0C0',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
  // Thêm kiểu cho buttonContainer
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  orderButton: {
    backgroundColor: '#C0C0C0',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 18,
    marginVertical: 10,
    paddingHorizontal: 20,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: 'justify',
    color: '#555',
  },
  relatedProductsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingHorizontal: 20,
    color: '#333',
  },
  relatedProductContainer: {
    marginRight: 15,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  relatedProductImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  relatedProductName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  relatedProductPrice: {
    fontSize: 12,
    color: '#E63946',
  },
  back: {
    padding: 5,
    marginTop: 10,
    marginLeft: -10,
  },
});

export default ProductDetailScreen;
