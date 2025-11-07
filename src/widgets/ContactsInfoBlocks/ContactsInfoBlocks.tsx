import ContactsInfoBlocksClient from './ContactsInfoBlocksClient';
import { InfoBlock } from '@/shared/api/pages/contacts/types';

interface IContactsInfoBlocksProps {
  infoBlocks: InfoBlock[];
}

const ContactsInfoBlocks = ({ infoBlocks }: IContactsInfoBlocksProps) => {
  if (!infoBlocks || infoBlocks.length === 0) {
    return null;
  }

  return <ContactsInfoBlocksClient infoBlocks={infoBlocks} />;
};

export default ContactsInfoBlocks;

