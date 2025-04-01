import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const AuthMiddleware = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/login'); // Redirigir al login si no hay token
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>;
};

export default AuthMiddleware;