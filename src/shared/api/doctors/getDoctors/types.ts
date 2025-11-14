// WordPress базовые типы
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

// ACF структура для фактов о враче
export interface DoctorFact {
  fact: {
    title: string;
    content: string;
  };
}

// ACF структура для врача
export interface DoctorACF {
  full_name: string;
  specialization: string;
  facts: DoctorFact[];
  education: string; // HTML
  image: string; // URL изображения
  services: Array<{
    service: false | number; // Может быть false или ID услуги
  }>;
  reviews: false | any; // Может быть false или объект отзывов
  promos?: Array<{
    promo: false | number; // Может быть false или ID акции
  }>;
}

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
  'wp:attachment'?: WordPressLink[];
  curies?: WordPressLink[];
}

// Основной интерфейс для врача
export interface Doctor {
  id: number;
  date: string;
  'service-type': number[];
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
  acf: DoctorACF;
  _links: WordPressLinks;
}
