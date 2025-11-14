import { getPromoById } from '@/shared/api/promos/getPromoById';
import { PromosBlock as PromosBlockType } from '@/shared/api/pages/main/types';
import PromosBlockClient from './PromosBlockClient';

interface IPromosBlockProps {
  promosBlock: PromosBlockType;
}

const PromosBlock = async ({ promosBlock }: IPromosBlockProps) => {
  console.log(promosBlock);
  if (!promosBlock?.promos) {
    return null;
  }

  // Извлекаем ID из promo объектов
  const promoIds = promosBlock.promos.map((promo) => promo.promo.ID);
  console.log('promoIds', promoIds);

  if (promoIds.length === 0) {
    return null;
  }

  // Получаем данные для каждой акции через Promise.all
  // Используем Promise.allSettled для обработки ошибок отдельных запросов
  const promosResults = await Promise.allSettled(
    promoIds.map((id) => getPromoById(id))
  );

  console.log('promosResults', promosResults);
  // Фильтруем успешные результаты
  const promosData = promosResults
    .filter(
      (result): result is PromiseFulfilledResult<any> =>
        result.status === 'fulfilled' && result.value !== null
    )
    .map((result) => result.value);

  console.log('promosData', promosData);

  if (promosData.length === 0) {
    return null;
  }

  return <PromosBlockClient title={promosBlock.title} promos={promosData} />;
};

export default PromosBlock;
