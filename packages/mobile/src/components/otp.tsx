import Animated, { LinearTransition } from "react-native-reanimated";
import { Pressable, Text, View } from "react-native";
import { useState } from "react";
import { apiURI } from "../libs/utils";
import { type AuthResponseType } from "api-handler/schema";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { reloadAppAsync } from "expo";
import handler from "../libs/api-handler";

export const AuthOTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth, checkAuth } = useAuth();
  const handleAuth = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await handler.getAuthCode();
      setAuth(data.code);
    } catch (e) {
      console.log(e);
    }
    await reloadAppAsync();
  };
  return (
    <View className="flex-1 bg-background justify-center gap-8 max-w-[90%] mx-auto">
      <Text className="text-2xl text-white text-center">
        Authentication - OTP
      </Text>
      <Button onPressOut={async () => await handleAuth()}>
        Send Auth Request
      </Button>
      <Animated.View layout={LinearTransition}></Animated.View>
      <Text className="mt-12 text-neutral-500 text-center">
        For details on getting started, run the server docker container and read
        the documentation
      </Text>
    </View>
  );
};
