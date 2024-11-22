import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProductDetail from "./ProductDetail"; // Đường dẫn đến file ProductDetail
import home from "./home"; // Đường dẫn đến file ProductDetail
import Cart from "./cart";
import SearchResultsScreen from "./SearchResultsScreen";
import RegisterScreen from "./register";
import LoginScreen from "./(tabs)";
import Home from "./home";
import AccountScreen from "./AccountScreen";
import CategoryProducts from "./CategoryProducts";
import Checkout from "./Checkout";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    
      <Stack.Navigator initialRouteName="SearchResultsScreen">
        <Stack.Screen
          name="SearchResultsScreen"
          component={SearchResultsScreen}
          options={{ headerShown: false }}
        />
   

      </Stack.Navigator>
      <Stack.Navigator initialRouteName="ProductDetail">
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="Cart" component={Cart} />
      </Stack.Navigator>
      <Stack.Navigator initialRouteName="AccountScreen">
        <Stack.Screen
          name="AccountScreen"
          component={AccountScreen}
          options={{ headerShown: false }}
        />
         </Stack.Navigator>
         <Stack.Navigator initialRouteName="CategoryProducts">
        <Stack.Screen
          name="CategoryProducts"
          component={CategoryProducts}
          options={{ headerShown: false }}
        />
         </Stack.Navigator>
         <Stack.Navigator initialRouteName="Checkout">
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{ headerShown: false }}
        />
         </Stack.Navigator>
    </NavigationContainer>
  );
}
