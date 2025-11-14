import type { Metadata } from 'next';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

export const SEO_DEFAULTS = {
  siteName: 'Ветеринарный центр Приморский',
  defaultTitle: 'Ветеринарный центр Приморский в Санкт-Петербурге',
  defaultDescription:
    'Полный спектр ветеринарных услуг: консультации, диагностика, хирургия и уход за питомцами в Санкт-Петербурге.',
  defaultOgImage: '/images/banner_seo.png',
};

const normalizePath = (pathname: string) =>
  pathname.startsWith('/') ? pathname : `/${pathname}`;

export const buildAbsoluteUrl = (pathname = '/') => {
  const base = SITE_URL || 'https://vetcenter-spb.ru';
  return new URL(normalizePath(pathname), `${base}/`).toString();
};

export const stripHtml = (html?: string, maxLength = 160) => {
  if (!html) return '';
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1).trim()}…`;
};

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string | null;
  type?: 'website' | 'article' | 'profile';
  robots?: Metadata['robots'];
};

export const createMetadata = ({
  title,
  description,
  canonicalPath = '/',
  ogImage,
  type = 'website',
  robots,
}: CreateMetadataOptions): Metadata => {
  const resolvedTitle = title || SEO_DEFAULTS.defaultTitle;
  const resolvedDescription = description || SEO_DEFAULTS.defaultDescription;
  const canonical = buildAbsoluteUrl(canonicalPath);
  const imageUrl = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : buildAbsoluteUrl(ogImage)
    : buildAbsoluteUrl(SEO_DEFAULTS.defaultOgImage);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: SEO_DEFAULTS.siteName,
      type,
      locale: 'ru_RU',
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [imageUrl],
    },
    robots,
  };
};

const LOGO_PATH = '/images/logo_full.svg';

export const buildOrganizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SEO_DEFAULTS.siteName,
  url: buildAbsoluteUrl('/'),
  logo: buildAbsoluteUrl(LOGO_PATH),
});

export const buildWebsiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SEO_DEFAULTS.siteName,
  url: buildAbsoluteUrl('/'),
  potentialAction: {
    '@type': 'SearchAction',
    target: `${buildAbsoluteUrl('/services')}?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const buildBreadcrumbJsonLd = (
  items: Array<{ name: string; url: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: buildAbsoluteUrl(item.url),
  })),
});

export const buildServiceJsonLd = ({
  name,
  description,
  slug,
  image,
}: {
  name: string;
  description?: string;
  slug: string;
  image?: string | null;
}) => {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description: description || SEO_DEFAULTS.defaultDescription,
    provider: {
      '@type': 'Organization',
      name: SEO_DEFAULTS.siteName,
      url: buildAbsoluteUrl('/'),
    },
    areaServed: {
      '@type': 'City',
      name: 'Санкт-Петербург',
    },
    url: buildAbsoluteUrl(`/services/${slug}`),
  };

  if (image) {
    data.image = [image.startsWith('http') ? image : buildAbsoluteUrl(image)];
  }

  return data;
};

export const buildPhysicianJsonLd = ({
  name,
  description,
  id,
  image,
  specialization,
}: {
  name: string;
  description?: string;
  id: number;
  image?: string | null;
  specialization?: string;
}) => {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name,
    description: description || SEO_DEFAULTS.defaultDescription,
    medicalSpecialty: specialization,
    url: buildAbsoluteUrl(`/doctors/${id}`),
    employer: {
      '@type': 'Organization',
      name: SEO_DEFAULTS.siteName,
      url: buildAbsoluteUrl('/'),
    },
  };

  if (image) {
    data.image = image.startsWith('http') ? image : buildAbsoluteUrl(image);
  }

  return data;
};

export const buildArticleJsonLd = ({
  title,
  description,
  slug,
  image,
  author,
  datePublished,
  dateModified,
}: {
  title: string;
  description?: string;
  slug: string;
  image?: string | null;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}) => {
  const canonical = buildAbsoluteUrl(`/blog/${slug}`);
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description || SEO_DEFAULTS.defaultDescription,
    mainEntityOfPage: canonical,
    url: canonical,
    author: {
      '@type': 'Person',
      name: author || SEO_DEFAULTS.siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_DEFAULTS.siteName,
      logo: {
        '@type': 'ImageObject',
        url: buildAbsoluteUrl(LOGO_PATH),
      },
    },
  };

  if (image) {
    data.image = [image.startsWith('http') ? image : buildAbsoluteUrl(image)];
  }

  if (datePublished) {
    data.datePublished = datePublished;
  }

  if (dateModified) {
    data.dateModified = dateModified;
  }

  return data;
};
