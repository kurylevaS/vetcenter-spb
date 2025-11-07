import { ServiceType } from '@/shared/api/serviceTypes/getServiceTypes/types';
import ServiceTypesListBlockClient from './ServiceTypesListBlockClient';

interface IServiceTypesListBlockProps {
  serviceTypes: ServiceType[];
  initialSearch?: string;
}

const ServiceTypesListBlock = ({ serviceTypes, initialSearch }: IServiceTypesListBlockProps) => {
  if (!serviceTypes || serviceTypes.length === 0) {
    return null;
  }

  return <ServiceTypesListBlockClient serviceTypes={serviceTypes} initialSearch={initialSearch} />;
};

export default ServiceTypesListBlock;

