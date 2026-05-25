"use client";

import { 
  LayoutGrid, Globe, Briefcase, MapPin, Flag, TrendingUp, 
  Monitor, Landmark, Trophy, FlaskConical, Leaf, HeartPulse, Shield
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  All: LayoutGrid,
  National: Landmark,
  International: Globe,
  Business: Briefcase,
  Commerce: TrendingUp,
  Technology: Monitor,
  Politics: Flag,
  Sports: Trophy,
  Science: FlaskConical,
  Environment: Leaf,
  Regional: MapPin,
  Health: HeartPulse,
  Geopolitics: Shield,
};

export default function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  const { data: session } = useSession();

  const categories = [
    { name: "All" },
    { name: "National" },
    { name: "International" },
    { name: "Business" },
    { name: "Commerce" },
    { name: "Technology" },
    { name: "Politics" },
    { name: "Sports" },
    { name: "Science" },
    { name: "Environment" },
    { name: "Regional" },
    { name: "Health" },
    { name: "Geopolitics" },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-theme-border/60 transition-colors duration-300">
      <nav className="flex items-center gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.name];
          const isActive = selectedCategory === cat.name;
          
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex items-center gap-2 whitespace-nowrap text-xs font-bold tracking-widest uppercase transition-all duration-300 py-1 border-b-2 cursor-pointer ${
                isActive
                  ? "text-theme-fg border-theme-fg scale-105"
                  : "text-theme-muted hover:text-theme-fg border-transparent"
              }`}
            >
              {Icon && (
                <Icon 
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isActive ? "rotate-3 scale-110 text-theme-fg" : "group-hover:scale-110"
                  }`} 
                />
              )}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </nav>

      {session?.user && (
        <div className="flex items-center gap-3 pl-4 md:border-l border-theme-border/60">
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-theme-fg">{session.user.name}</p>
            <p className="text-[10px] text-theme-muted">{session.user.email}</p>
          </div>
          {session.user.image ? (
            <img src={session.user.image} alt="User Avatar" className="w-8 h-8 rounded-full border border-theme-border shadow-sm" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-theme-accent/20 flex items-center justify-center text-theme-accent font-bold text-xs border border-theme-accent/30">
              {session.user.name?.charAt(0) || "U"}
            </div>
          )}
          <button 
            onClick={() => signOut()}
            className="text-xs font-bold text-theme-muted hover:text-red-500 uppercase tracking-widest ml-2 transition-colors cursor-pointer"
            title="Sign Out"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

