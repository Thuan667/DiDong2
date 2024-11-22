import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { Api } from './api'; // Ensure the path is correct
import { ip } from './api'; // Ensure the path is correct

// Define the type for a single product
interface Product {
  id: number;
  name: string;
  price: number;
  photo: string; // Adjust the type based on your API response
}

// Define the type for route parameters
interface RouteParams {
  categoryId: number; // Adjust the type based on your API
}

export default function CategoryProducts() {
  const route = useRoute();
  const { categoryId } = route.params as RouteParams; // Type the route parameters
  const [products, setProducts] = useState<Product[]>([]); // Type the products state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${Api}/categories/${categoryId}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products by category:', error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productItem}>
      <Image 
        source={{ uri: `${ip}/storage/products/${item.photo}` }} 
        style={styles.productImage} 
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} $</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products in Category</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2} // Hiển thị 2 sản phẩm mỗi hàng
        columnWrapperStyle={styles.columnWrapper} // Căn chỉnh các cột
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  productItem: {
    flex: 1, // Chiếm không gian còn lại của cột
    margin: 10, // Khoảng cách giữa các sản phẩm
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Căn giữa khoảng cách giữa các cột
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center', // Căn giữa tên sản phẩm
  },
  productPrice: {
    color: '#28A745',
    fontWeight: 'bold',
  },
});
