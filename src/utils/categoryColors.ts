export const getCategoryColor = (category: string) => {
  switch (category) {
    case "Commerce": return "text-teal-700 dark:text-teal-400";
    case "National": return "text-blue-800 dark:text-blue-300";
    case "International": return "text-purple-800 dark:text-purple-300";
    case "Regional": return "text-orange-700 dark:text-orange-300";
    case "Business": return "text-sky-700 dark:text-sky-300";
    case "Technology": return "text-cyan-700 dark:text-cyan-300";
    case "Politics": return "text-red-700 dark:text-red-300";
    case "Sports": return "text-amber-700 dark:text-amber-300";
    case "Health": return "text-rose-700 dark:text-rose-400";
    case "Geopolitics": return "text-indigo-600 dark:text-indigo-400";
    case "Science": return "text-indigo-800 dark:text-indigo-300";
    case "Environment": return "text-green-700 dark:text-green-300";
    case "Entertainment": return "text-pink-800 dark:text-pink-400";
    case "Markets": return "text-emerald-700 dark:text-emerald-400";
    case "Economy": return "text-fuchsia-700 dark:text-fuchsia-400";
    case "Industry": return "text-slate-700 dark:text-slate-400";
    case "Internet": return "text-violet-700 dark:text-violet-400";
    case "Agriculture": return "text-lime-700 dark:text-lime-400";
    case "States": return "text-cyan-800 dark:text-cyan-500";
    case "Cities": return "text-yellow-700 dark:text-yellow-400";
    case "Andhra Pradesh": return "text-rose-800 dark:text-rose-500";
    case "Opinion": return "text-zinc-700 dark:text-zinc-400";
    case "Editorial": return "text-neutral-700 dark:text-neutral-400";
    case "Books": return "text-amber-800 dark:text-amber-500";
    case "Education": return "text-blue-700 dark:text-blue-400";
    case "Elections": return "text-red-800 dark:text-red-500";
    case "All": return "text-theme-fg";
    default: return "text-stone-600 dark:text-stone-400";
  }
};
