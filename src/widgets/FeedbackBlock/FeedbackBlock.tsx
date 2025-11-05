import FeedbackBlockClient from './FeedbackBlockClient';
import { FeedbackBlock as FeedbackBlockType } from '@/shared/api/pages/main/types';

interface IFeedbackBlockProps {
  feedbackBlock: FeedbackBlockType;
}

export const FeedbackBlock = ({ feedbackBlock }: IFeedbackBlockProps) => {
  if (!feedbackBlock) {
    return null;
  }

  return (
    <FeedbackBlockClient
      title={feedbackBlock.title}
      description={feedbackBlock.description}
      button_text={feedbackBlock.button_text}
    />
  );
};