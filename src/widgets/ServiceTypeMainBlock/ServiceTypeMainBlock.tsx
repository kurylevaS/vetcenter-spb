import { ServiceTypeBySlug } from '@/shared/api/serviceTypes/getServiceTypeBySlug/types';
import ServiceTypeMainBlockClient from './ServiceTypeMainBlockClient';

interface IServiceTypeMainBlockProps {
  serviceType: ServiceTypeBySlug;
}

const ServiceTypeMainBlock = ({ serviceType }: IServiceTypeMainBlockProps) => {
  if (!serviceType) {
    return null;
  }

  return (
    <ServiceTypeMainBlockClient
      title={serviceType.acf.name}
      description={serviceType.acf.description}
      gallery={serviceType.acf.gallery}
    />
  );
};

export default ServiceTypeMainBlock;
