// Экспортируем типы из getServiceByTaxonomy, так как они одинаковые
export type {
  Service,
  ServiceACF,
  ServiceByTaxonomy,
  Review as ServiceReview,
  WordPressGuid,
  WordPressTitle,
  WordPressContent,
  WordPressMeta,
  WordPressLink,
  WordPressLinks,
  WordPressEmbedded,
  EmbeddedTerm,
} from '@/shared/api/serviceTypes/getServiceByTaxonomy/types';
