
import { OtpInput } from 'react-native-otp-entry';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

export const AuthOTP = () => {
  return (
    <View className='flex-1 bg-black justify-center gap-8'>
      <Text className='text-2xl text-white text-center mb-4'>Authentication Code</Text>
      <OtpInput
        numberOfDigits={6}
        focusColor="white"
        focusStickBlinkingDuration={1000}
        onFilled={(text) => console.log(`OTP is ${text}`)}
        textInputProps={{
          accessibilityLabel: "One-Time Password",
        }}
        autoFocus={false}
        theme={{
          containerStyle: styles.container,
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: styles.activePinCodeContainer,
        }}
      />
      <Pressable className='bg-white p-2.5 rounded-3xl'><Text className='text-black text-center'>Submit</Text></Pressable>
      <Text className='mt-12 text-neutral-500 text-center'>For details on getting started, run the server docker container and read the documentation</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.8,
    marginHorizontal: Dimensions.get('window').width * 0.2,
  },
  pinCodeContainer: {
    backgroundColor: '#000',
    borderColor: '#808080',
    borderRadius: 20,
    width: 45,
  },
  pinCodeText: {
    color: '#f0f0f0',
  },
  focusStick: {
    backgroundColor: '#fff',
  },
  activePinCodeContainer: {
    borderColor: '#fff',
  },
});
