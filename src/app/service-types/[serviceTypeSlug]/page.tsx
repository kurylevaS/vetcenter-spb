import { getServiceTypeBySlug } from '@/shared/api/serviceTypes/getServiceTypeBySlug';
import { getServiceByServiceType } from '@/shared/api/serviceTypes/getServiceByTaxonomy';
import ServiceTypeMainBlock from '@/widgets/ServiceTypeMainBlock/ServiceTypeMainBlock';
import ServicesListBlock from '@/widgets/ServicesListBlock/ServicesListBlock';

interface IServiceTypePageProps {
  params: {
    serviceTypeSlug: string;
  };
  searchParams: {
    search?: string;
  };
}

export default async function ServiceTypePage({
  params,
  searchParams,
}: IServiceTypePageProps) {
  const { serviceTypeSlug } = params;

  // Получаем информацию о категории услуги
  const serviceType = await getServiceTypeBySlug(serviceTypeSlug);

  if (!serviceType) {
    return null;
  }

  // Получаем услуги этой категории с параметром поиска
  const services = await getServiceByServiceType(
    serviceType['service-type'][0],
    {
      search: searchParams.search,
    }
  );

  return (
    <>
      <main>
        <ServiceTypeMainBlock serviceType={serviceType} />
        <ServicesListBlock
          services={services}
          initialSearch={searchParams.search}
        />
      </main>
    </>
  );
}
