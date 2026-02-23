import { useThemePreference } from "@/hooks/use-theme-preference";

export function useColorScheme() {
  const { isDark } = useThemePreference();
  return isDark ? "dark" : "light";
}
