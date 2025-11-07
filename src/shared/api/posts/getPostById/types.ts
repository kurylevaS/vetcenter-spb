// ACF структура для поста блога
export interface PostACF {
  title: string;
  description: string;
  content: string; // HTML
  blog_category: false | any; // Может быть false или объект категории
  author: string;
  image_min: string; // URL миниатюры для карточки
  image_full: string; // URL полного изображения
}

// Основной интерфейс для поста (ответ содержит только acf)
export interface PostById {
  acf: PostACF;
  id: number;
  slug: string;
}
