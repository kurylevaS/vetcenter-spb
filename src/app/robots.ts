import type { MetadataRoute } from 'next';
import { buildAbsoluteUrl } from '@/shared/lib/seo';

const isPreview =
  process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = buildAbsoluteUrl('/sitemap.xml');

  if (isPreview) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: sitemapUrl,
  };
}
