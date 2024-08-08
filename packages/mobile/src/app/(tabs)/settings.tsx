import { Button } from "../../components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { View } from "react-native";

export default function Tab() {
  const { logout } = useAuth();
  return (
    <View className="flex-1 flex-col-reverse bg-background pb-4 px-4">
      <Button onPressOut={logout} variant="secondary">
        Logout
      </Button>
    </View>
  );
}
