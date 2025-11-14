// WordPress типы
export interface WordPressGuid {
  rendered: string;
}

export interface WordPressTitle {
  rendered: string;
}

export interface WordPressContent {
  rendered: string;
  protected: boolean;
}

export interface WordPressMeta {
  _acf_changed?: boolean;
  [key: string]: any;
}

export interface WordPressLink {
  href: string;
  targetHints?: {
    allow?: string[];
  };
}

export interface WordPressLinks {
  self?: WordPressLink[];
  collection?: WordPressLink[];
  about?: WordPressLink[];
  'wp:attachment'?: WordPressLink[];
  curies?: WordPressLink[];
  [key: string]: any;
}

// ACF поля промо
export interface PromoACF {
  title: string;
  description: string;
  deadline: string; // "11/30/2025"
  conditions: string;
  cost: string;
  duration?: string; // Длительность акции (опционально)
  type: 'procent' | 'fixed'; // Тип скидки: процент или фиксированная сумма
  amount: string; // Размер скидки (процент или сумма)
  banner_image: string;
  image: string;
}

// Основной интерфейс промо
export interface Promo {
  id: number;
  date: string;
  date_gmt: string;
  guid: WordPressGuid;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WordPressTitle;
  content: WordPressContent;
  featured_media: number;
  template: string;
  meta: WordPressMeta;
  class_list: string[];
  acf: PromoACF;
  _links: WordPressLinks;
}
