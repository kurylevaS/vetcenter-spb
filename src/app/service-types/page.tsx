import { getServiceTypes } from '@/shared/api/serviceTypes/getServiceTypes';
import ServiceTypesListBlock from '@/widgets/ServiceTypesListBlock/ServiceTypesListBlock';

interface IServiceTypesPageProps {
  searchParams: {
    search?: string;
  };
}

export default async function ServiceTypesPage({
  searchParams,
}: IServiceTypesPageProps) {
  // Передаем параметр поиска в API
  const serviceTypes = await getServiceTypes({
    search: searchParams.search,
  });

  if (!serviceTypes || serviceTypes.length === 0) {
    return null;
  }

  return (
    <>
      <main>
        <ServiceTypesListBlock
          serviceTypes={serviceTypes}
          initialSearch={searchParams.search}
        />
      </main>
    </>
  );
}
