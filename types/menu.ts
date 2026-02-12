import type { LucideIcon } from "lucide-react-native";

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  route?: string;
  color?: string;
  onPress?: () => void;
}
