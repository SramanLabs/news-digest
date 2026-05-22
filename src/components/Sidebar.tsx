import { 
  LayoutGrid, Globe, Briefcase, MapPin, Flag, TrendingUp, 
  Monitor, Landmark, Trophy, HeartPulse, FlaskConical, Leaf, Film 
} from "lucide-react";

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
  Health: HeartPulse,
  Science: FlaskConical,
  Environment: Leaf,
  Entertainment: Film,
  Regional: MapPin,
};

export default function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  const categories = [
    { name: "All" },
    { name: "National" },
    { name: "International" },
    { name: "Business" },
    { name: "Commerce" },
    { name: "Technology" },
    { name: "Politics" },
    { name: "Sports" },
    { name: "Health" },
    { name: "Science" },
    { name: "Environment" },
    { name: "Entertainment" },
    { name: "Regional" },
  ];

  return (
    <nav className="flex items-center gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-3 border-b border-theme-border/60 transition-colors duration-300">
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
  );
}

