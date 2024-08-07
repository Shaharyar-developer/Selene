import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import Animated, { useSharedValue, withDelay, withSpring } from "react-native-reanimated"

export default function Tab() {
  const height = useSharedValue(0);
  useEffect(() => {
    height.value = withDelay(500, withSpring(Dimensions.get('window').height * 0.75));
  }, [])
  return (
    <View className='flex-1 bg-black'>
      <Animated.View
        className='bg-neutral-900 rounded-3xl mt-4'
        style={{
          height
        }}>
      </Animated.View>
    </View>
  );
}
