// WordPress Post типы
export interface WordPressPost {
  ID: number;
  post_author: string;
  post_date: string;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_excerpt: string;
  post_status: string;
  comment_status: string;
  ping_status: string;
  post_password: string;
  post_name: string;
  to_ping: string;
  pinged: string;
  post_modified: string;
  post_modified_gmt: string;
  post_content_filtered: string;
  post_parent: number;
  guid: string;
  menu_order: number;
  post_type: string;
  post_mime_type: string;
  comment_count: string;
  filter: string;
}

// Button тип
export interface Button {
  title: string;
  link: string;
}

// Main Block типы
export interface BannerSlide {
  banner_slide: {
    title_main: string;
    title_sub: string;
    description: string;
    button: Button;
  };
}

export interface MainBlock {
  banner_slides: BannerSlide[];
}

// Service Block типы
export interface ServiceItem {
  service_type: WordPressPost;
}

export interface ServiceBlock {
  title: string;
  description: string;
  services: ServiceItem[];
}

// About Block типы
export interface AboutBlockButton {
  titile: string; // Опечатка в API (должно быть title, но API возвращает titile)
  link: string;
}

export interface AboutBlock {
  title: string;
  description: string;
  button: AboutBlockButton;
  gallery: string[];
}

// Features Block типы
export interface Feature {
  feature: {
    title: string;
    description: string;
    icon: string;
  };
}

export interface FeaturesBlock {
  title: string;
  features: Feature[];
}

// Team Block типы
export interface TeamMember {
  doctor: number;
}

export interface TeamBlock {
  title: string;
  team: TeamMember[];
}

// Reviews Block типы
export interface Review {
  review: {
    author: string;
    review_text: string;
    author_image: string;
  };
}

export interface ReviewsBlock {
  title: string;
  gallery: string[];
  reviews: Review[];
}

// Blog Block типы
export interface BlogPost {
  post: false | number; // Может быть false или объект поста
}

export interface BlogBlock {
  title: string;
  posts: BlogPost[];
}

// Feedback Block типы
export interface FeedbackBlock {
  title: string;
  description: string;
  button_text: string;
}

// ACF структура главной страницы
export interface MainPageACF {
  main_block: MainBlock;
  service_block: ServiceBlock;
  about_block: AboutBlock;
  features_block: FeaturesBlock;
  team_block: TeamBlock;
  reviews_block: ReviewsBlock;
  blog_block: BlogBlock;
  feedback_block: FeedbackBlock;
}

// Основной интерфейс для ответа API
export interface MainPageInterface {
  acf: MainPageACF;
}