import { getPromoById } from '@/shared/api/promos/getPromoById';
import DoctorPromosBlockClient from './DoctorPromosBlockClient';

interface IDoctorPromosBlockProps {
  promoIds: number[];
}

const DoctorPromosBlock = async ({ promoIds }: IDoctorPromosBlockProps) => {
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

  return <DoctorPromosBlockClient promos={promosData} />;
};

export default DoctorPromosBlock;
