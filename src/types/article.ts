export interface Article {
  id: string;
  published_date: string; // ISO 8601 format e.g. "2023-10-25"
  category: "National" | "International" | "Commerce" | "Regional" | "Business" | "Technology" | "Politics" | "Sports" | "Health" | "Science" | "Environment" | "Entertainment" | string;
  headline: string;
  description: string;
  source_url: string;
}

export interface NewsResponse {
  articles: Article[];
}
