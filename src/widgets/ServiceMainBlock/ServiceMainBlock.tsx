import ServiceMainBlockClient from './ServiceMainBlockClient';
import { Service } from '@/shared/api/services/types';

interface IServiceMainBlockProps {
  service: Service;
}

const ServiceMainBlock = ({ service }: IServiceMainBlockProps) => {
  if (!service) {
    return null;
  }

  console.log(service);

  return (
    <ServiceMainBlockClient
      title={service.acf.name || service.title.rendered}
      description={service.acf.description}
      image={service.acf.image}
      cost={service.acf.cost}
      duration={service.acf.duration}
      reviews={service.acf.reviews || []}
    />
  );
};

export default ServiceMainBlock;
