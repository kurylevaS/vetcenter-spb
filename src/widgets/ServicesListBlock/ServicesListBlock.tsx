import { ServiceByTaxonomy } from '@/shared/api/serviceTypes/getServiceByTaxonomy/types';
import ServicesListBlockClient from './ServicesListBlockClient';

interface IServicesListBlockProps {
  services: ServiceByTaxonomy;
  initialSearch?: string;
}

const ServicesListBlock = ({ services, initialSearch }: IServicesListBlockProps) => {
  if (!services || services.length === 0) {
    return null;
  }

  return <ServicesListBlockClient services={services} initialSearch={initialSearch} />;
};

export default ServicesListBlock;

