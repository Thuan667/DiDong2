import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Product } from './home'; // Đảm bảo bạn đã xuất Product từ HomeScreen
import { useNavigation } from '@react-navigation/native';
import {ip} from "./api"
type SearchResultsScreenRouteProp = RouteProp<{ 
  SearchResultsScreen: { results: Product[], query: string }; // Chỉnh sửa tên tham số từ 'searchTerm' thành 'query'
}, 'SearchResultsScreen'>;

const SearchResultsScreen: React.FC = () => {
  const route = useRoute<SearchResultsScreenRouteProp>();
  const { results, query } = route.params; // Truy cập các tham số đã truyền
  const navigation = useNavigation(); 

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product }); // Điều hướng tới màn hình ProductDetail và truyền sản phẩm đã chọn
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item)}>
      <Image 
        style={styles.productImage} 
        source={{ uri: `${ip}/storage/products/${item.photo}` }} 
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} $</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Results : <Text style={styles.searchTerm}>{query}</Text></Text> {/* Hiển thị tên tìm kiếm */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2} // Đặt số cột là 2
        contentContainerStyle={styles.listContainer} // Thêm style cho FlatList
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  searchTerm: {
    fontWeight: 'normal', // Thay đổi kiểu chữ để dễ phân biệt
    fontSize: 30,
    color: '#28A745', // Màu sắc để nổi bật
  },
  listContainer: {
    paddingBottom: 20, // Thêm khoảng cách cho phần dưới của danh sách
  },
  productItem: {
    flex: 1, // Chiếm không gian còn lại
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginHorizontal: 5, // Khoảng cách bên trái và bên phải
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  productName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    color: '#28A745',
    fontWeight: 'bold',
  },
});

export default SearchResultsScreen;
