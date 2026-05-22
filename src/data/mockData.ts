import { getLocalDateString } from "@/utils/date";

export interface Article {
  id: string;
  published_date: string; // ISO 8601 format e.g. "2023-10-25"
  category: "National" | "International" | "Commerce" | "Regional" | "Business" | "Technology" | "Politics" | "Sports" | "Health" | "Science" | "Environment" | "Entertainment";
  headline: string;
  description: string;
  source_url: string;
}

const getOffsetDateString = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return getLocalDateString(d);
};

export const mockArticles: Article[] = [
  {
    id: "1",
    published_date: getOffsetDateString(0),
    category: "Commerce",
    headline: "RBI Announces New Monetary Policy Reforms",
    description: "The Reserve Bank of India has introduced a slew of measures to manage inflation, keeping the repo rate unchanged at 6.5%. The decision aims to balance growth with price stability in the face of global headwinds. This will likely impact banking liquidity and corporate borrowing costs in the upcoming quarter.",
    source_url: "https://example.com/rbi-policy"
  },
  {
    id: "2",
    published_date: getOffsetDateString(0),
    category: "National",
    headline: "Supreme Court Delivers Verdict on Electoral Bonds",
    description: "In a landmark judgment, the Supreme Court has struck down the electoral bonds scheme as unconstitutional, citing the citizens' right to information. This move introduces greater transparency into political funding ahead of the general elections, reshaping campaign finance structures.",
    source_url: "https://example.com/sc-electoral-bonds"
  },
  {
    id: "3",
    published_date: getOffsetDateString(0),
    category: "International",
    headline: "US Fed Signals Potential Rate Cuts by Year-End",
    description: "The US Federal Reserve indicated that it might initiate rate cuts later this year if inflation continues its downward trajectory. This dovish stance has spurred global equity markets, although concerns remain over underlying inflation stickiness and geopolitical tensions.",
    source_url: "https://example.com/fed-rate-cuts"
  },
  {
    id: "4",
    published_date: getOffsetDateString(1),
    category: "Regional",
    headline: "State Government Launches New Tech Hub in Bengaluru",
    description: "A new technology park spread over 150 acres has been inaugurated in Bengaluru's outskirts to foster startups in AI and clean energy. The state government estimates this will create over 50,000 direct jobs, further cementing the city's position as India's Silicon Valley.",
    source_url: "https://example.com/bengaluru-tech-hub"
  },
  {
    id: "5",
    published_date: getOffsetDateString(1),
    category: "Commerce",
    headline: "India's Q3 GDP Growth Surpasses Expectations at 8.4%",
    description: "Propelled by robust manufacturing and construction activity, India's GDP grew at an impressive 8.4% in the third quarter. The data underscores the resilience of the domestic economy, prompting several rating agencies to revise their annual growth forecasts upwards.",
    source_url: "https://example.com/india-gdp-growth"
  },
  {
    id: "6",
    published_date: getOffsetDateString(2),
    category: "International",
    headline: "European Union Agrees on Comprehensive AI Act",
    description: "The EU parliament has passed the world's first comprehensive legal framework on Artificial Intelligence. The act categorizes AI systems by risk, imposing strict transparency requirements on high-risk applications while banning systems that pose unacceptable threats to fundamental rights.",
    source_url: "https://example.com/eu-ai-act"
  },
  {
    id: "7",
    published_date: getOffsetDateString(0),
    category: "Technology",
    headline: "Quantum Computing Breakthrough in Deep Learning",
    description: "Researchers have successfully utilized quantum algorithms to train deep neural networks exponentially faster than classical supercomputers. This breakthrough is expected to accelerate advancements in drug discovery, climate modeling, and complex financial risk assessment.",
    source_url: "https://example.com/quantum-ai"
  },
  {
    id: "8",
    published_date: getOffsetDateString(0),
    category: "Sports",
    headline: "India Secures Record Medal Haul at Asian Games",
    description: "The Indian contingent delivered a historic performance, surpassing the 100-medal mark for the first time in the Asian Games. The athletes dominated in athletics, shooting, and archery, showcasing the country's growing sporting prowess on the international stage.",
    source_url: "https://example.com/asian-games-india"
  },
  {
    id: "9",
    published_date: getOffsetDateString(1),
    category: "Environment",
    headline: "Global Summit Commits to Phase Out Fossil Fuels",
    description: "In a historic agreement, delegates at the UN Climate Summit have pledged to transition away from fossil fuels in energy systems. The accord aims to accelerate climate action this decade, though developing nations emphasize the need for substantial financial support.",
    source_url: "https://example.com/climate-summit"
  },
  {
    id: "10",
    published_date: getOffsetDateString(2),
    category: "Health",
    headline: "New mRNA Vaccine Shows Promise Against Malaria",
    description: "Early-stage clinical trials of a novel mRNA-based malaria vaccine have demonstrated high efficacy rates. If successful in subsequent phases, this could represent a paradigm shift in combating one of the world's most deadly infectious diseases, particularly in sub-Saharan Africa.",
    source_url: "https://example.com/mrna-malaria"
  },
  {
    id: "11",
    published_date: getOffsetDateString(0),
    category: "Politics",
    headline: "Parliament Passes Sweeping Data Protection Bill",
    description: "The controversial Data Protection Bill has been signed into law, establishing a new framework for how companies collect and process citizens' data. Tech companies now face strict compliance requirements and significant penalties for data breaches.",
    source_url: "https://example.com/data-protection-bill"
  },
  {
    id: "12",
    published_date: getOffsetDateString(1),
    category: "Entertainment",
    headline: "Independent Film Sweeps Major Awards Ceremony",
    description: "A low-budget independent feature directed by a first-time filmmaker has dominated this year's top film awards, winning Best Picture and Best Director. The unexpected triumph underscores a shifting landscape in cinematic storytelling.",
    source_url: "https://example.com/indie-film-awards"
  },
  {
    id: "13",
    published_date: getOffsetDateString(0),
    category: "Science",
    headline: "Astronomers Discover Potentially Habitable Exoplanet",
    description: "Using the James Webb Space Telescope, scientists have identified a rocky exoplanet in the habitable zone of its star. The planet shows signs of an atmosphere containing water vapor, making it a prime candidate for future studies on extraterrestrial life.",
    source_url: "https://example.com/habitable-exoplanet"
  },
  {
    id: "14",
    published_date: getOffsetDateString(1),
    category: "Business",
    headline: "Global Supply Chain Disruptions Ease as Freight Costs Drop",
    description: "The persistent supply chain bottlenecks that have plagued the global economy for the past two years are showing signs of significant easing. Shipping rates have plummeted to pre-pandemic levels, bringing relief to importers and manufacturers.",
    source_url: "https://example.com/supply-chain-easing"
  }
];

