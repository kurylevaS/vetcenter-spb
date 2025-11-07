import { getServiceBySlug } from '@/shared/api/services/getServiceBySlug';
import { getMainPage } from '@/shared/api/pages/main';
import ServiceMainBlock from '@/widgets/ServiceMainBlock/ServiceMainBlock';
import { FeedbackBlock } from '@/widgets/FeedbackBlock/FeedbackBlock';
import { notFound } from 'next/navigation';

interface IServicePageProps {
  params: {
    slug: string;
  };
}

export default async function ServicePage({ params }: IServicePageProps) {
  const { slug } = params;

  // Получаем информацию об услуге
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Получаем данные главной страницы для формы обратной связи
  const pageData = await getMainPage();

  return (
    <>
      <main>
        <ServiceMainBlock service={service} />
        {pageData?.feedback_block && (
          <FeedbackBlock feedbackBlock={pageData.feedback_block} />
        )}
      </main>
    </>
  );
}
