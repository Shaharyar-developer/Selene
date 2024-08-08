import { Stack } from 'expo-router/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../providers/authProvider';

export default function Layout() {
  return (
    <AuthProvider>
      <SafeAreaView className='bg-background flex-1'>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </SafeAreaView>
    </AuthProvider>
  );
}
