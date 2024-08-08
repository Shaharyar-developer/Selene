import Constants from "expo-constants";
const { expoConfig } = Constants;
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const apiURI =
  `http://${Constants.expoConfig?.hostUri?.split(":").shift()?.concat(":3000")}` ??
  "API_PATH";
