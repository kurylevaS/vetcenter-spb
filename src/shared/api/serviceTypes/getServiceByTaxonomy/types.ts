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

// Review структура из ACF
export interface Review {
  review: {
    author: string;
    content: string;
    mark: string | number;
  };
}

// ACF структура для services (из ответа API)
export interface ServiceACF {
  name: string;
  description: string;
  icon: string; // URL иконки
  image: string; // URL изображения
  cost: string;
  duration: string;
  reviews: Review[];
  service_type?: number[]; // ID терминов таксономии
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

// Embedded термины таксономии
export interface EmbeddedTerm {
  id: number;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  acf: any[];
  _links: WordPressLinks;
}

export interface WordPressEmbedded {
  'wp:term'?: EmbeddedTerm[][];
}

// Основной интерфейс для Service (из /services endpoint)
export interface Service {
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
  parent: number;
  template: string;
  meta: WordPressMeta;
  'service-type': number[]; // ID терминов таксономии service-type
  class_list: string[];
  acf: ServiceACF;
  _links: WordPressLinks;
  _embedded?: WordPressEmbedded;
}

// Тип для массива Service (возвращаемое значение getServiceByTaxonomy)
export type ServiceByTaxonomy = Service[];
