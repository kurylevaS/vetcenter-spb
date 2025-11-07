// Main Block типы для страницы About
export interface AboutMainBlock {
  gallery: string[];
  title: string;
  content: string;
}

// Feature тип (используется и на главной странице)
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

// ACF структура страницы About
export interface AboutPageACF {
  main_block: AboutMainBlock;
  features_block: FeaturesBlock;
}

// Основной интерфейс для ответа API
export interface AboutPageInterface {
  acf: AboutPageACF;
}
