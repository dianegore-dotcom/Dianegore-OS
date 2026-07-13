import {
  Archive,
  BriefcaseBusiness,
  CalendarCheck2,
  FolderKanban,
  Home,
  Inbox,
  Layers3,
  Search,
} from "lucide-react";

export const primaryNav = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/today", label: "Today", icon: CalendarCheck2 },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/areas", label: "Areas", icon: Layers3 },
  { href: "/tasks", label: "Tasks", icon: BriefcaseBusiness },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/search", label: "Search", icon: Search },
  { href: "/vaults", label: "Vaults", icon: Archive },
];
