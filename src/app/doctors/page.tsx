import { getDoctors } from '@/shared/api/doctors/getDoctors';
import { getServiceTypes } from '@/shared/api/serviceTypes/getServiceTypes';
import DoctorsListBlock from '@/widgets/DoctorsListBlock/DoctorsListBlock';

interface IDoctorsPageProps {
  searchParams: {
    search?: string;
    service_type?: string;
  };
}

export default async function DoctorsPage({ searchParams }: IDoctorsPageProps) {
  // Получаем все типы услуг для фильтров
  const serviceTypes = await getServiceTypes();

  // Получаем врачей с параметрами поиска и фильтрации
  const serviceTypeId = searchParams.service_type
    ? parseInt(searchParams.service_type)
    : undefined;

  const doctors = await getDoctors({
    search: searchParams.search,
    serviceType: serviceTypeId,
  });

  return (
    <>
      <main>
        <DoctorsListBlock
          doctors={doctors || []}
          initialSearch={searchParams.search}
          serviceTypes={serviceTypes}
          initialServiceType={serviceTypeId}
        />
      </main>
    </>
  );
}
