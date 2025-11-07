import { Doctor } from '@/shared/api/doctors/getDoctors/types';
import { ServiceType } from '@/shared/api/serviceTypes/getServiceTypes/types';
import DoctorsListBlockClient from './DoctorsListBlockClient';

interface IDoctorsListBlockProps {
  doctors: Doctor[];
  initialSearch?: string;
  serviceTypes?: ServiceType[];
  initialServiceType?: number;
}

const DoctorsListBlock = ({
  doctors,
  initialSearch,
  serviceTypes,
  initialServiceType,
}: IDoctorsListBlockProps) => {
  return (
    <DoctorsListBlockClient
      doctors={doctors || []}
      initialSearch={initialSearch}
      serviceTypes={serviceTypes}
      initialServiceType={initialServiceType}
    />
  );
};

export default DoctorsListBlock;

