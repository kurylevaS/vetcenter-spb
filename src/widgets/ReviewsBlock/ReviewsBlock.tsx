import { ReviewsBlock as ReviewsBlockType } from '@/shared/api/pages/main/types';
import ReviewsBlockClient from './ReviewsBlockClient';

interface IReviewsBlockProps {
  reviewsBlock: ReviewsBlockType;
}

const ReviewsBlock = ({ reviewsBlock }: IReviewsBlockProps) => {
  if (!reviewsBlock) {
    return null;
  }

  return (
    <ReviewsBlockClient
      title={reviewsBlock.title}
      gallery={reviewsBlock.gallery}
      reviews={reviewsBlock.reviews}
    />
  );
};

export default ReviewsBlock;
