import { getDoctorById } from '@/shared/api/doctors/getDoctorById';
import { getServices } from '@/shared/api/services/getServices';
import { getMainPage } from '@/shared/api/pages/main';
import DoctorMainBlock from '@/widgets/DoctorMainBlock/DoctorMainBlock';
import DoctorServicesBlock from '@/widgets/DoctorServicesBlock/DoctorServicesBlock';
import DoctorReviewsBlock from '@/widgets/DoctorReviewsBlock/DoctorReviewsBlock';
import { FeedbackBlock } from '@/widgets/FeedbackBlock/FeedbackBlock';
import { notFound } from 'next/navigation';
import { Service } from '@/shared/api/services/types';

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
    const serviceIds = doctor.acf.services
      .map((item: any) => {return item.service})

    // Получаем все услуги и фильтруем по ID
    if (serviceIds.length > 0) {
      const allServices = await getServices();
      services = allServices.filter((service) => serviceIds.includes(service.id));
    }
  }

  // Получаем отзывы из acf.reviews
  const reviews = doctor.acf.reviews && Array.isArray(doctor.acf.reviews) 
    ? doctor.acf.reviews 
    : [];

  // Получаем данные главной страницы для формы обратной связи
  const pageData = await getMainPage();


  return (
    <>
      <main>
        <DoctorMainBlock doctor={doctor} />
        <DoctorServicesBlock services={services} />
        {reviews.length > 0 && <DoctorReviewsBlock reviews={reviews} />}
        {pageData?.feedback_block && (
          <FeedbackBlock feedbackBlock={pageData.feedback_block} />
        )}
      </main>
    </>
  );
}

