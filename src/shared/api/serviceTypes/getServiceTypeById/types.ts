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

// ACF структура для service_types (при запросе по ID возвращаются URL-ы)
export interface ServiceTypeACF {
  taxonomy: number[];
  name: string;
  description: string;
  gallery: string[]; // URL-ы изображений
  icon: string; // URL иконки
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
  'acf:attachment'?: WordPressLink[];
  'acf:term'?: WordPressLink[];
  'wp:attachment'?: WordPressLink[];
  'wp:term'?: WordPressLink[];
  curies?: WordPressLink[];
}

// Основной интерфейс для service_type (одиночный элемент)
export interface ServiceTypeById {
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
  'service-type': any[];
  class_list: string[];
  acf: ServiceTypeACF;
  _links: WordPressLinks;
}
