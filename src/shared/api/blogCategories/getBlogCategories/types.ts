// WordPress Links структура
export interface WordPressLink {
  href: string;
  targetHints?: {
    allow: string[];
  };
  embeddable?: boolean;
  taxonomy?: string;
}

export interface WordPressLinks {
  self?: WordPressLink[];
  collection?: WordPressLink[];
  about?: WordPressLink[];
  'wp:post_type'?: WordPressLink[];
  curies?: WordPressLink[];
}

// Основной интерфейс для категории блога
export interface BlogCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
  acf: any[];
  _links: WordPressLinks;
}

