import DoctorMainBlockClient from './DoctorMainBlockClient';
import { Doctor } from '@/shared/api/doctors/getDoctors/types';

interface IDoctorMainBlockProps {
  doctor: Doctor;
}

const DoctorMainBlock = ({ doctor }: IDoctorMainBlockProps) => {
  if (!doctor) {
    return null;
  }

  return (
    <DoctorMainBlockClient
      fullName={doctor.acf.full_name}
      specialization={doctor.acf.specialization}
      facts={doctor.acf.facts || []}
      education={doctor.acf.education}
      image={doctor.acf.image}
    />
  );
};

export default DoctorMainBlock;

