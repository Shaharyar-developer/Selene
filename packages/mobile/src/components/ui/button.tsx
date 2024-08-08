import { cn } from "../../libs/utils";
import { Pressable, Text, type PressableProps } from "react-native";
import Animated from "react-native-reanimated";

type ButtonProps = {
  children: React.ReactNode;
  variant?: keyof ButtonVariants;
  size?: "sm" | "md" | "lg";
} & PressableProps;
type ButtonVariant = {
  container: string;
  text: string;
};
type ButtonVariants = {
  primary: ButtonVariant;
  secondary: ButtonVariant;
  ghost: ButtonVariant;
  danger: ButtonVariant;
  warning: ButtonVariant;
  success: ButtonVariant;
};
const base = {
  container: "py-2 px-4 rounded-3xl",
  text: `font-medium text-center`,
};
const Variants: ButtonVariants = {
  primary: {
    container: `${base.container} bg-white`,
    text: `${base.text} text-neutral-900 font-medium text-center`,
  },
  secondary: {
    container: `${base.container} bg-neutral-800`,
    text: `${base.text} text-white font-medium text-center`,
  },
  ghost: {
    container: `${base.container} bg-transparent`,
    text: `${base.text} text-white font-medium text-center`,
  },
  danger: {
    container: `${base.container} bg-red-700`,
    text: `${base.text} text-white font-medium text-center`,
  },
  warning: {
    container: `${base.container} bg-orange-600`,
    text: `${base.text} text-white font-medium text-center`,
  },
  success: {
    container: `${base.container} bg-green-600`,
    text: `${base.text} text-white font-medium text-center`,
  },
};

export const Button = ({
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <AnimatedPressable
      onPressIn={(e) => {}}
      onPressOut={(e) => {}}
      className={cn(Variants[variant].container, props.className)}
      {...props}
    >
      <Text className={cn(`text-${size}`, Variants[variant].text)}>
        {props.children}
      </Text>
    </AnimatedPressable>
  );
};
