import DoctorReviewsBlockClient from './DoctorReviewsBlockClient';
import { ServiceReview } from '@/shared/api/services/types';

interface IDoctorReviewsBlockProps {
  reviews: ServiceReview[];
}

const DoctorReviewsBlock = ({ reviews }: IDoctorReviewsBlockProps) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return <DoctorReviewsBlockClient reviews={reviews} />;
};

export default DoctorReviewsBlock;
