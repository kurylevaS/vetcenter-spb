import { Promo } from '@/shared/api/promos/types';
import PromosListBlockClient from './PromosListBlockClient';

interface IPromosListBlockProps {
  promos: Promo[];
  initialSearch?: string;
}

const PromosListBlock = ({ promos, initialSearch }: IPromosListBlockProps) => {
  return (
    <PromosListBlockClient
      promos={promos || []}
      initialSearch={initialSearch}
    />
  );
};

export default PromosListBlock;
