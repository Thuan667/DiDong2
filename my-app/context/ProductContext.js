import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/products/category/${categoryId}`);
      setProducts(response.data); // Cập nhật danh sách sản phẩm
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, fetchProductsByCategory }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
