import { ArrowRight } from "lucide-react";
import { Article } from "@/data/mockData";
import { formatLocalDate } from "@/utils/date";

export default function NewsCard({ article }: { article: Article }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Commerce": return "text-[#0F766E] dark:text-[#2DD4BF]";
      case "National": return "text-[#1E3A8A] dark:text-[#93C5FD]";
      case "International": return "text-[#6B21A8] dark:text-[#D8B4FE]";
      case "Regional": return "text-[#C2410C] dark:text-[#FDBA74]";
      case "Business": return "text-[#0369A1] dark:text-[#7DD3FC]";
      case "Technology": return "text-[#0E7490] dark:text-[#67E8F9]";
      case "Politics": return "text-[#B91C1C] dark:text-[#FCA5A5]";
      case "Sports": return "text-[#B45309] dark:text-[#FCD34D]";
      case "Health": return "text-[#991B1B] dark:text-[#F87171]";
      case "Science": return "text-[#4338CA] dark:text-[#A5B4FC]";
      case "Environment": return "text-[#15803D] dark:text-[#86EFAC]";
      case "Entertainment": return "text-[#9D174D] dark:text-[#F472B6]";
      default: return "text-[#6B6055] dark:text-[#9A9182]";
    }
  };

  return (
    <article className="group break-inside-avoid flex flex-col justify-between py-2 transition-opacity hover:opacity-85 border-b border-theme-border/50 pb-8 transition-colors duration-300">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-extrabold tracking-widest uppercase ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
          <span className="w-1 h-1 rounded-full bg-theme-border"></span>
          <span className="text-xs font-bold text-theme-muted uppercase tracking-widest">
            {formatLocalDate(article.published_date, { month: 'short', day: 'numeric', year: 'numeric'})}
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-theme-fg mb-4 leading-[1.1] tracking-tight transition-colors duration-300">
          {article.headline}
        </h2>
        
        <p className="text-theme-fg/80 text-base md:text-lg leading-relaxed mb-6 font-medium transition-colors duration-300">
          {article.description}
        </p>
      </div>
      
      <div className="mt-4">
        <a 
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-theme-fg group-hover:underline underline-offset-4 decoration-2 transition-colors duration-300"
        >
          Read Original Source
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  );
}
