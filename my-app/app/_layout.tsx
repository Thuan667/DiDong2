// app/RootLayout.js
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ProductProvider } from '@/context/ProductContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import SearchResults from './SearchResultsScreen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ProductProvider>
        <Stack initialRouteName="login">
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="home" options={{ headerTitle: '', headerBackVisible: false, headerShown: false }} />
          <Stack.Screen name="ProductDetail" options={{ headerTitle: '', headerBackVisible: false, headerShown: false }} />
          <Stack.Screen name="cart" options={{ headerTitle: '', headerBackVisible: false, headerShown: false }} />
          <Stack.Screen name="register" options={{ headerTitle: '', headerBackVisible: false, headerShown: false }} />
          {/* <Stack.Screen name="Checkout" options={{ headerTitle: '', headerBackVisible: false, headerShown: false }} /> */}
          {/* <Stack.Screen name="SearchResults" options={{ headerTitle: '', headerBackVisible: false, headerShown: false }} /> */}
          </Stack>
      </ProductProvider>
    </ThemeProvider>
  );
}
