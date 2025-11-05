import { getServiceTypeById } from '@/shared/api/serviceTypes/getServiceTypeById';
import { ServiceBlock } from '@/shared/api/pages/main/types';
import ServiceTypesBlockClient from './ServiceTypesBlockClient';

interface IServiceTypesBlockProps {
  serviceBlock: ServiceBlock;
}

const ServiceTypesBlock = async ({ serviceBlock }: IServiceTypesBlockProps) => {
  if (!serviceBlock?.services) {
    return null;
  }

  // Извлекаем ID из service_type объектов
  const serviceIds = serviceBlock.services
    .map(service => service.service_type?.ID)
    .filter((id): id is number => typeof id === 'number');

  if (serviceIds.length === 0) {
    return null;
  }

  // Получаем данные для каждого типа услуги через Promise.all
  // Используем Promise.allSettled для обработки ошибок отдельных запросов
  const serviceTypesResults = await Promise.allSettled(
    serviceIds.map(id => getServiceTypeById(id))
  );

  // Фильтруем успешные результаты
  const serviceTypesData = serviceTypesResults
    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
    .map(result => result.value);

  if (serviceTypesData.length === 0) {
    return null;
  }

  return (
    <ServiceTypesBlockClient
      title={serviceBlock.title}
      description={serviceBlock.description}
      serviceTypes={serviceTypesData}
    />
  );
};

export default ServiceTypesBlock;
