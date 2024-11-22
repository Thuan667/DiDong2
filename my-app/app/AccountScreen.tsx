import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Api } from "./api";

interface User {
  id: number;
  name: string;
  email: string;
}

const AccountScreen: React.FC = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwt_token");
      await AsyncStorage.removeItem("user_id");
      router.push('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt_token");
      const userId = await AsyncStorage.getItem("user_id");

      if (!token || !userId) {
        setError('Token or User ID does not exist. Please log in again.');
        return;
      }

      const response = await fetch(`${Api}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('An error occurred while fetching user information');

      const data = await response.json();
      setUser(data);
      setUpdatedName(data.name);
      setUpdatedEmail(data.email);
    } catch (error) {
      setError((error as Error).message);
      console.error("Error while fetching user information:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt_token");
      const userId = await AsyncStorage.getItem("user_id");

      const response = await fetch(`${Api}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: updatedName, email: updatedEmail }),
      });

      if (!response.ok) throw new Error('An error occurred while updating user information');

      setSuccessMessage('User information updated successfully!');
      setError(null);
      await fetchUser();
      setIsEditing(false);
    } catch (error) {
      setError((error as Error).message);
      console.error("Error while updating user information:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt_token");
      const userId = await AsyncStorage.getItem("user_id");

      const response = await fetch(`${Api}/users/${userId}/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'An error occurred while changing the password');

      setPasswordMessage('Password changed successfully!');
      setError(null);
    } catch (error) {
      setPasswordMessage((error as Error).message);
      console.error("Error while changing password:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Information</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        user && (
          <View style={styles.contentContainer}>
            {/* Phần thông tin tài khoản */}
            <View style={styles.card}>
              <Text style={styles.userName}>Name: {isEditing ? (
                <TextInput style={styles.input} value={updatedName} onChangeText={setUpdatedName} />
              ) : (
                user.name
              )}</Text>

              <Text style={styles.userEmail}>Email: {isEditing ? (
                <TextInput style={styles.input} value={updatedEmail} onChangeText={setUpdatedEmail} keyboardType="email-address" />
              ) : (
                user.email
              )}</Text>

              <TouchableOpacity style={styles.button} onPress={isEditing ? handleUpdateUser : () => setIsEditing(!isEditing)}>
                <Text style={styles.buttonText}>{isEditing ? "Save" : "Edit"}</Text>
              </TouchableOpacity>

              {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
            </View>

            {/* Phần thay đổi mật khẩu */}
            <View style={styles.card}>
              <Text style={styles.title}>Change Password</Text>
              <TextInput style={styles.input} placeholder="Current Password" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
              <TextInput style={styles.input} placeholder="New Password" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
              <TextInput style={styles.input} placeholder="Confirm New Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
              <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>

              {passwordMessage && <Text style={styles.successText}>{passwordMessage}</Text>}
            </View>
          </View>
        )
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3F51B5',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#3F51B5',
    marginVertical: 5,
    padding: 8,
    width: '100%',
  },
  button: {
    backgroundColor: '#3F51B5',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#D32F2F',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successText: {
    color: '#388E3C',
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default AccountScreen;
