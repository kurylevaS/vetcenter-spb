
import { feedbackModalActions, FeedbackModalMetadata } from '@/shared/store/feedbackModalSlice';
import { useAppDispatch } from '../store/hooks/useAppDispatch';

export const useOpenFeedbackModal = () => {
  const dispatch = useAppDispatch();

  return (metadata?: FeedbackModalMetadata) => {
    dispatch(feedbackModalActions.openModal(metadata));
  };
};

