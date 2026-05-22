import { getLocalDateString, formatLocalDate } from "@/utils/date";

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DateSelector({ selectedDate, onSelectDate }: DateSelectorProps) {
  const todayStr = getLocalDateString(new Date());

  // Generate last 7 days in the user's local timezone
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return getLocalDateString(d);
  });

  return (
    <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1">
      {dates.map((date) => {
        const isToday = date === todayStr;
        const displayDate = formatLocalDate(date, { month: 'short', day: 'numeric' });
        
        return (
          <button
            key={date}
            onClick={() => onSelectDate(date)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 border cursor-pointer ${
              selectedDate === date
                ? "bg-theme-accent text-theme-bg border-theme-accent shadow-md shadow-theme-fg/5"
                : "bg-transparent text-theme-muted hover:text-theme-fg border-theme-border/80 hover:border-theme-muted/50"
            }`}
          >
            {isToday ? "Today" : displayDate}
          </button>
        );
      })}
    </div>
  );
}

