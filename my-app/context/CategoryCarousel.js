import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const CategoryCarousel = ({ title, categoryId, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (categoryId) {
      getProducts(categoryId);
    }
  }, [categoryId]);

  const getProducts = async (categoryId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/product/categories/${categoryId}`);
      setProducts(response.data);
      setError(false);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setError(true);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể lấy sản phẩm. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productContainer} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
      <Image style={styles.productImage} source={{ uri: `http://127.0.0.1:8000/storage/products/${item.photo}` }} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} VND</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (products.length === 0) {
    return <Text>Không có sản phẩm nào trong danh mục này.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Carousel
        data={products}
        renderItem={renderProduct}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width * 0.7}
        layout={"default"}
      />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  productName: {
    marginTop: 10,
    fontWeight: '500',
  },
  productPrice: {
    color: '#28A745',
    fontWeight: 'bold',
  },
});

export default CategoryCarousel;
