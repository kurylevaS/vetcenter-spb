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

// ACF структура для поста блога (в списке)
export interface PostACF {
  title: string;
  description: string;
  content: string; // HTML
  blog_category: false | any;
  author: string;
  image_min: string; // URL миниатюры
  image_full: string; // URL полного изображения
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

// Основной интерфейс для поста (в списке)
export interface Post {
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
  blog_category: number[]; // ID категорий блога на верхнем уровне
  class_list: string[];
  acf: PostACF;
  _links: WordPressLinks;
}
