import FontAwesome from "@expo/vector-icons/AntDesign";
import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { LoadingState } from "./loading";
import { useAuth } from "@/src/hooks/useAuth";
import { View } from "react-native";
import { AuthOTP } from "@/src/components/otp";

export default function TabLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const { checkAuth, isAuthenticated } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      checkAuth();
      setIsLoading(false);
    };
    verifyAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background">
        <AuthOTP />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#080808",
          borderTopWidth: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="plus" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="setting" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
