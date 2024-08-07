import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { LoadingState } from './loading';
import { useAuth } from '@/src/hooks/useAuth';
import { View } from 'react-native';
import { AuthOTP } from '@/src/components/otp';

export default function TabLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth()
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  if (isLoading) {
    return <LoadingState />;
  }
  if (!isAuthenticated) {
    return (
      <View className='flex-1 bg-black'>
        <AuthOTP />
      </View>
    )
  }
  if (isAuthenticated) return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#808080',
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
