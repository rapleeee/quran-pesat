import type { MenuItem } from "@/types/menu";
import {
  BookOpen,
  BookOpenText,
  Coins,
  Compass,
  Heart,
  LayoutGrid,
  MessageCircle,
  Scroll,
} from "lucide-react-native";

export const menuItems: MenuItem[] = [
  {
    id: "alquran",
    label: "Al-Quran",
    icon: BookOpen,
    route: "/alquran",
    color: "#728d8d",
  },
  {
    id: "doa",
    label: "Doa Harian",
    icon: MessageCircle,
    route: "/doa",
    color: "#728d8d",
  },
  {
    id: "dzikir",
    label: "Dzikir Duha",
    icon: Heart,
    route: "/dzikir",
    color: "#728d8d",
  },
  {
    id: "hadits",
    label: "Hadits",
    icon: Scroll,
    route: "/hadits",
    color: "#728d8d",
  },
  {
    id: "kiblat",
    label: "Arah Kiblat",
    icon: Compass,
    route: "/kiblat",
    color: "#728d8d",
  },
  {
    id: "donasi",
    label: "Donasi",
    icon: Coins,
    route: "/donasi",
    color: "#728d8d",
  },
  {
    id: "asmaul-husna",
    label: "Asmaul Husna",
    icon: BookOpenText,
    route: "/asmaul-husna",
    color: "#728d8d",
  },
  {
    id: "lainnya",
    label: "Lainnya",
    icon: LayoutGrid,
    route: "/lainnya",
    color: "#728d8d",
  },
];
