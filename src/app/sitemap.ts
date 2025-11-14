import type { MetadataRoute } from 'next';
import { buildAbsoluteUrl } from '@/shared/lib/seo';
import { getServices } from '@/shared/api/services/getServices';
import { getServiceTypes } from '@/shared/api/serviceTypes/getServiceTypes';
import { getDoctors } from '@/shared/api/doctors/getDoctors';
import { getPosts } from '@/shared/api/posts/getPosts';
import { getPromos } from '@/shared/api/promos/getPromos';

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: buildAbsoluteUrl('/') },
  { url: buildAbsoluteUrl('/services') },
  { url: buildAbsoluteUrl('/service-types') },
  { url: buildAbsoluteUrl('/doctors') },
  { url: buildAbsoluteUrl('/promos') },
  { url: buildAbsoluteUrl('/blog') },
  { url: buildAbsoluteUrl('/contacts') },
  { url: buildAbsoluteUrl('/about') },
];

const toDate = (value?: string) => (value ? new Date(value) : new Date());

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [...STATIC_ROUTES];

  const tasks: Array<Promise<void>> = [];

  tasks.push(
    (async () => {
      try {
        const services = await getServices();
        services?.forEach((service) => {
          routes.push({
            url: buildAbsoluteUrl(`/services/${service.slug}`),
            lastModified: toDate(service.modified || service.date),
          });
        });
      } catch (error) {
        console.error('Failed to fetch services for sitemap:', error);
      }
    })()
  );

  tasks.push(
    (async () => {
      try {
        const serviceTypes = await getServiceTypes();
        serviceTypes?.forEach((serviceType) => {
          routes.push({
            url: buildAbsoluteUrl(`/service-types/${serviceType.slug}`),
            lastModified: toDate(serviceType.modified || serviceType.date),
          });
        });
      } catch (error) {
        console.error('Failed to fetch service types for sitemap:', error);
      }
    })()
  );

  tasks.push(
    (async () => {
      try {
        const doctors = await getDoctors();
        doctors?.forEach((doctor) => {
          routes.push({
            url: buildAbsoluteUrl(`/doctors/${doctor.id}`),
            lastModified: toDate(doctor.modified || doctor.date),
          });
        });
      } catch (error) {
        console.error('Failed to fetch doctors for sitemap:', error);
      }
    })()
  );

  tasks.push(
    (async () => {
      try {
        const posts = await getPosts();
        posts?.forEach((post) => {
          routes.push({
            url: buildAbsoluteUrl(`/blog/${post.slug}`),
            lastModified: toDate(post.modified || post.date),
          });
        });
      } catch (error) {
        console.error('Failed to fetch posts for sitemap:', error);
      }
    })()
  );

  tasks.push(
    (async () => {
      try {
        const promos = await getPromos();
        promos?.forEach((promo) => {
          routes.push({
            url: buildAbsoluteUrl(`/promos/${promo.slug}`),
            lastModified: toDate(promo.modified || promo.date),
          });
        });
      } catch (error) {
        console.error('Failed to fetch promos for sitemap:', error);
      }
    })()
  );

  await Promise.all(tasks);

  return routes;
}
