import { Service } from '@/shared/api/services/types';
import { ServiceType } from '@/shared/api/serviceTypes/getServiceTypes/types';
import ServicesListBlockClient from './ServicesListBlockClient';

interface IServicesListBlockProps {
  services: Service[];
  initialSearch?: string;
  serviceTypes?: ServiceType[];
  initialServiceType?: number;
}

const ServicesListBlock = ({
  services,
  initialSearch,
  serviceTypes,
  initialServiceType,
}: IServicesListBlockProps) => {
  return (
    <ServicesListBlockClient
      services={services || []}
      initialSearch={initialSearch}
      serviceTypes={serviceTypes}
      initialServiceType={initialServiceType}
    />
  );
};

export default ServicesListBlock;
