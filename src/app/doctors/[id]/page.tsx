import type { Metadata } from 'next';
import { getDoctorById } from '@/shared/api/doctors/getDoctorById';
import { getServices } from '@/shared/api/services/getServices';
import { getMainPage } from '@/shared/api/pages/main';
import DoctorMainBlock from '@/widgets/DoctorMainBlock/DoctorMainBlock';
import DoctorServicesBlock from '@/widgets/DoctorServicesBlock/DoctorServicesBlock';
import DoctorReviewsBlock from '@/widgets/DoctorReviewsBlock/DoctorReviewsBlock';
import DoctorPromosBlock from '@/widgets/DoctorPromosBlock/DoctorPromosBlock';
import { FeedbackBlock } from '@/widgets/FeedbackBlock/FeedbackBlock';
import { notFound } from 'next/navigation';
import { Service } from '@/shared/api/services/types';
import {
  createMetadata,
  SEO_DEFAULTS,
  stripHtml,
  buildBreadcrumbJsonLd,
  buildPhysicianJsonLd,
} from '@/shared/lib/seo';

// ISR: страница будет автоматически обновляться каждые 60 секунд
// + мгновенное обновление через webhook при изменении в админке
export const revalidate = 60;

interface IDoctorPageProps {
  params: {
    id: string;
  };
}

export default async function DoctorPage({ params }: IDoctorPageProps) {
  const { id } = params;
  const doctorId = parseInt(id);

  if (isNaN(doctorId)) {
    notFound();
  }

  // Получаем информацию о враче
  const doctor = await getDoctorById(doctorId);

  if (!doctor) {
    notFound();
  }

  // Получаем услуги врача из acf.services
  let services: Service[] = [];
  if (doctor.acf.services && Array.isArray(doctor.acf.services)) {
    // Извлекаем ID услуг из массива
    const serviceIds = doctor.acf.services.map((item: any) => {
      return item.service;
    });

    // Получаем все услуги и фильтруем по ID
    if (serviceIds.length > 0) {
      const allServices = await getServices();
      services = allServices.filter((service) =>
        serviceIds.includes(service.id)
      );
    }
  }

  // Получаем отзывы из acf.reviews
  const reviews =
    doctor.acf.reviews && Array.isArray(doctor.acf.reviews)
      ? doctor.acf.reviews
      : [];

  // Получаем промо из acf.promos
  const promoIds =
    doctor.acf.promos && Array.isArray(doctor.acf.promos)
      ? doctor.acf.promos
          .map((item: any) => item.promo)
          .filter((id): id is number => typeof id === 'number' && id > 0)
      : [];

  const education = doctor.acf.education || '';

  // Получаем данные главной страницы для формы обратной связи
  const pageData = await getMainPage();

  const doctorDescription = stripHtml(education, 160);
  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Команда', url: '/doctors' },
    { name: doctor.acf.full_name, url: `/doctors/${doctor.id}` },
  ]);
  const physicianJsonLd = buildPhysicianJsonLd({
    name: doctor.acf.full_name,
    description: doctorDescription,
    id: doctor.id,
    image: doctor.acf.image || null,
    specialization: doctor.acf.specialization,
  });

  return (
    <>
      <main>
        <DoctorMainBlock doctor={doctor} />
        {services.length > 0 && <DoctorServicesBlock services={services} />}
        {reviews.length > 0 && <DoctorReviewsBlock reviews={reviews} />}
        {promoIds.length > 0 && <DoctorPromosBlock promoIds={promoIds} />}
        {pageData?.feedback_block && (
          <FeedbackBlock feedbackBlock={pageData.feedback_block} />
        )}
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const doctorId = parseInt(params.id, 10);

  if (Number.isNaN(doctorId)) {
    return createMetadata({
      title: `Карточка врача не найдена | ${SEO_DEFAULTS.siteName}`,
      description: 'Страница врача не найдена.',
      canonicalPath: `/doctors/${params.id}`,
      type: 'profile',
      robots: {
        index: false,
        follow: false,
      },
    });
  }

  try {
    const doctor = await getDoctorById(doctorId);
    const fullName =
      doctor?.acf?.full_name || doctor?.title?.rendered || 'Врач';
    const specialization = doctor?.acf?.specialization || '';
    const education = stripHtml(doctor?.acf?.education, 150);
    const facts = doctor?.acf?.facts
      ?.map((fact) => `${fact.fact?.title || ''}: ${fact.fact?.content || ''}`)
      .filter(Boolean)
      .slice(0, 2)
      .join('. ');

    const descriptionParts = [specialization, education, facts].filter(Boolean);
    const description =
      descriptionParts.join('. ') || SEO_DEFAULTS.defaultDescription;

    return createMetadata({
      title: `${fullName} — ${specialization || 'ветеринарный врач'} | ${SEO_DEFAULTS.siteName}`,
      description,
      canonicalPath: `/doctors/${doctor.id}`,
      ogImage: doctor?.acf?.image || null,
      type: 'profile',
    });
  } catch (error) {
    return createMetadata({
      title: `Карточка врача не найдена | ${SEO_DEFAULTS.siteName}`,
      description: 'Страница врача не найдена.',
      canonicalPath: `/doctors/${params.id}`,
      type: 'profile',
      robots: {
        index: false,
        follow: false,
      },
    });
  }
}
