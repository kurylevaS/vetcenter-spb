import { getPromoById } from '@/shared/api/promos/getPromoById';
import ServicePromosBlockClient from './ServicePromosBlockClient';

interface IServicePromosBlockProps {
  promoIds: number[];
}

const ServicePromosBlock = async ({ promoIds }: IServicePromosBlockProps) => {
  if (!promoIds || promoIds.length === 0) {
    return null;
  }

  // Получаем данные для каждой акции через Promise.all
  // Используем Promise.allSettled для обработки ошибок отдельных запросов
  const promosResults = await Promise.allSettled(
    promoIds.map((id) => getPromoById(id))
  );

  // Фильтруем успешные результаты
  const promosData = promosResults
    .filter(
      (result): result is PromiseFulfilledResult<any> =>
        result.status === 'fulfilled' && result.value !== null
    )
    .map((result) => result.value);

  if (promosData.length === 0) {
    return null;
  }

  return <ServicePromosBlockClient promos={promosData} />;
};

export default ServicePromosBlock;
