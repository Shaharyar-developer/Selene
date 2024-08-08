import { Stack } from 'expo-router/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import Animated, { useSharedValue, withTiming, withSequence, withDelay, Easing, withSpring, useAnimatedStyle, withRepeat } from 'react-native-reanimated';
import { View } from 'react-native';


export function LoadingState() {

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, {
          duration: 600,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(1, {
          duration: 600,
          easing: Easing.out(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, {
          duration: 600,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(1, {
          duration: 600,
          easing: Easing.out(Easing.ease),
        }),
      ),
      -1,
      true,
    );
  }, []);

  return (
    <View className='flex-1 justify-center items-center bg-background'>
      <Animated.View
        className='absolute inset-0'
        style={{
          backgroundColor: 'linear-gradient(135deg, #FF6F61, #D83A56)',
          opacity: opacity,
        }}
      />
      <Animated.View
        className='h-20 w-20 bg-white rounded-full'
        style={{
          transform: [{ scale: scale }],
        }}
      />
    </View>
  );
}
