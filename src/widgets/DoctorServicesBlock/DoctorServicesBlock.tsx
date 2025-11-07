import DoctorServicesBlockClient from './DoctorServicesBlockClient';
import { Service } from '@/shared/api/services/types';

interface IDoctorServicesBlockProps {
  services: Service[];
}

const DoctorServicesBlock = ({ services }: IDoctorServicesBlockProps) => {
  return <DoctorServicesBlockClient services={services || []} />;
};

export default DoctorServicesBlock;
