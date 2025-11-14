import PromoMainBlockClient from './PromoMainBlockClient';
import { Promo } from '@/shared/api/promos/types';

interface IPromoMainBlockProps {
  promo: Promo;
}

const PromoMainBlock = ({ promo }: IPromoMainBlockProps) => {
  if (!promo) {
    return null;
  }

  return (
    <PromoMainBlockClient
      title={promo.acf?.title || promo.title?.rendered || 'Акция'}
      description={promo.acf?.description || ''}
      image={promo.acf?.banner_image || promo.acf?.image || ''}
      deadline={promo.acf?.deadline || ''}
      conditions={promo.acf?.conditions || ''}
      cost={promo.acf?.cost || ''}
      duration={promo.acf?.duration || ''}
      discountType={promo.acf?.type || 'procent'}
      discountAmount={promo.acf?.amount || ''}
    />
  );
};

export default PromoMainBlock;
