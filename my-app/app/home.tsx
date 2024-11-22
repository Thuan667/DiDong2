import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, Text, View, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useProductContext } from '@/context/ProductContext';
import {Api} from "./api"
import {ip} from "./api"
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
export interface Product {
  id: string; 
  name: string; 
  photo: string; 
  description: string; 
  price: number; 
}

export interface Category {
  id: number;
  name: string;
  icon: string; 
}

export default function HomeScreen() {
  const navigation = useNavigation(); 
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const banners = [
    require('@/assets/images/slider/slider01.png'),
    require('@/assets/images/slider/slider02.png'),
    require('@/assets/images/slider/slider03.png'),
  ];

  useEffect(() => {
    axios.get(`${Api}/product/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
      });

    axios.get(`${Api}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm:", error);
      });

    // Tự động thay đổi banner mỗi 2 giây
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0, 
        duration: 500, 
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length); 
        fadeAnim.setValue(1); 
        Animated.timing(fadeAnim, {
          toValue: 1, 
          duration: 500, 
          useNativeDriver: true,
        }).start();
      });
    }, 3000); 

    return () => clearInterval(interval); 
  }, []);

  const handleSearch = () => {
    console.log("Từ khóa tìm kiếm:", searchQuery); // Log từ khóa tìm kiếm trước khi gửi request
    
    axios.get(`${Api}/product/search`, {
      params: { query: searchQuery },
    })
    .then((response) => {
      console.log("Kết quả tìm kiếm:", response.data);
      setSearchResults(response.data); 
      // Chuyển hướng tới màn hình kết quả tìm kiếm với kết quả tìm kiếm và từ khóa
      navigation.navigate('SearchResultsScreen', { results: response.data, query: searchQuery });
    })
    .catch((error) => {
      console.error("Lỗi khi tìm kiếm:", error);
    });
  }
  

  const addToCart = async (productId:string, quantity:number, price:number) => {
    try {
      const token = await AsyncStorage.getItem('jwt_token'); 
      const response = await fetch(`${Api}/product/cart-list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                productId,
                quantity,
                price,
            }),
        });

        const data = await response.json();

        if (response.status === 200) {
            alert(data.message);
        } else {
            console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", data);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const getIconName = (categoryId:number) => {
    switch (categoryId) {
      case 1: return 'shirt';
      case 2: return 'basket';
      case 3: return 'heart';
      case 4: return 'star';
      default: return 'help-circle';
    }
  };
  const fetchProductsByCategory = async (categoryId: number) => {
    try {
        const response = await axios.get(`${Api}/categories/${categoryId}/products`);
        if (response.status === 200) {
            setProducts(response.data); // Giả sử bạn muốn cập nhật state products
        } else {
            console.error("Lỗi khi lấy sản phẩm:", response.data);
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
};
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Image source={require('@/assets/images/logo-oficial-store.png')} style={styles.loginIcon} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Search for products..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={25} color="black" style={styles.searchIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartIcon} onPress={() => navigation.navigate('cart')}>
            <Ionicons name="cart" size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartIcon} onPress={() => navigation.navigate('AccountScreen')}>
          <AntDesign name="user" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Image style={styles.sliderImage} source={banners[currentIndex]} />
      </Animated.View>

      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryItem}
              onPress={() => {
                fetchProductsByCategory(category.id);
                navigation.navigate('CategoryProducts', { categoryId: category.id });
              }}
            >
              <Ionicons name={getIconName(category.id)} size={24} color="#333" style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.productContainer}>
        <Text style={styles.sectionTitle}>List Products</Text>
        <View style={styles.underline} />
        <View style={styles.scrollContainer}>
          <FlatList
            data={products}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.productItem}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              >
                <Image style={styles.productImage} source={{ uri: `${ip}/storage/products/${item.photo}` }} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString()} $</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.buyButton} 
                    onPress={() => addToCart(item.id, 1, item.price)} 
                  >
                    <Ionicons name="cart" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detailsButton}>
                    <Text style={styles.buttonText}>PayMent</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginVertical: 15,
  },
  sliderImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: 45,
    borderRadius: 8,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  categoryContainer: {
    marginVertical: 10,
    marginHorizontal: 7,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  categories: {
    flexDirection: 'row',
  },
  categoryIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  categoryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  productContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  scrollContainer: {
    maxHeight: 400, // Đặt chiều cao tối đa cho khung cuộn
    overflow: 'hidden',
  },
  productItem: {
    flex: 1,
    margin: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
  },
  productImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 14,
    color: '#28A745',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  buyButton: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  detailsButton: {
    backgroundColor: '#C0C0C0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  menuButton: {
    padding: 5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    flex: 1,
    marginHorizontal: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  cartIcon: {
    marginLeft: 10,
  },
  underline: {
    height: 2,
    width: '100%',
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  loginIcon: {
    width: 65,
    height: 40,
  },
});
