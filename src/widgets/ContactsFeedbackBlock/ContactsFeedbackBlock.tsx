import ContactsFeedbackBlockClient from './ContactsFeedbackBlockClient';
import { FeedbackBlock } from '@/shared/api/pages/contacts/types';

interface IContactsFeedbackBlockProps {
  feedbackBlock: FeedbackBlock;
}

const ContactsFeedbackBlock = ({
  feedbackBlock,
}: IContactsFeedbackBlockProps) => {
  if (!feedbackBlock) {
    return null;
  }

  return (
    <ContactsFeedbackBlockClient
      title={feedbackBlock.title}
      description={feedbackBlock.description}
      buttonText={feedbackBlock.button_text}
    />
  );
};

export default ContactsFeedbackBlock;
