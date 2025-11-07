import { getServiceTypes } from '@/shared/api/serviceTypes/getServiceTypes';
import ServicesListBlock from '@/widgets/ServicesListBlock/ServicesListBlock';
import { getServices } from '@/shared/api/services/getServices';

interface IServicesPageProps {
  searchParams: {
    search?: string;
    service_type?: string;
  };
}

export default async function ServicesPage({
  searchParams,
}: IServicesPageProps) {
  // Получаем все типы услуг для фильтров
  const serviceTypes = await getServiceTypes();

  // Получаем услуги с параметрами поиска и фильтрации
  const serviceTypeId = searchParams.service_type
    ? parseInt(searchParams.service_type)
    : undefined;

  const services = await getServices({
    search: searchParams.search,
    serviceType: serviceTypeId,
  });

  return (
    <>
      <main>
        <ServicesListBlock
          services={services || []}
          initialSearch={searchParams.search}
          serviceTypes={serviceTypes}
          initialServiceType={serviceTypeId}
        />
      </main>
    </>
  );
}
