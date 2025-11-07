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

// ACF структура для поста блога
export interface PostACF {
  title: string;
  description: string;
  content: string; // HTML
  blog_category:
    | false
    | {
        term_id: number;
        name: string;
        slug: string;
        term_group: number;
        term_taxonomy_id: number;
        taxonomy: string;
        description: string;
        parent: number;
        count: number;
        filter: string;
      };
  author: string;
  image_min: string; // URL миниатюры для карточки
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
  'acf:term'?: WordPressLink[];
  'wp:attachment'?: WordPressLink[];
  'wp:term'?: WordPressLink[];
  curies?: WordPressLink[];
}

// Основной интерфейс для поста (по слагу)
export interface PostBySlug {
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
