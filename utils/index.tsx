import {
  Home,
  Users,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  UsersRound,
  Library,
  CreditCard,
  Settings,
  CircleUser
} from "lucide-react";

export const sidebarLinks = [
  { name: "Bosh sahifa", icon: <Home className="h-4 w-4" />, path: "/" },
  { name: "Menejerlar", icon: <Users className="h-4 w-4" />, path: "/menagers" },
  { name: "Administratorlar", icon: <ShieldCheck className="h-4 w-4" />, path: "/admins" },
  { name: "O'qituvchilar", icon: <GraduationCap className="h-4 w-4" />, path: "/teachers" },
  { name: "O'quvchilar", icon: <BookOpen className="h-4 w-4" />, path: "/students" },
  { name: "Guruhlar", icon: <UsersRound className="h-4 w-4" />, path: "/groups" },
  { name: "Kurslar", icon: <Library className="h-4 w-4" />, path: "/courses" },
  { name: "To'lovlar", icon: <CreditCard className="h-4 w-4" />, path: "/payment" },
];
export const other_links = [
  { name: "Sozlamalar", icon: <Settings className="h-4 w-4" />, path: "/settings" },
  { name: "Profil", icon: <CircleUser className="h-4 w-4" />, path: "/profile" },
];
