'use client';

import { InfoBlock } from '@/shared/api/pages/contacts/types';

interface IContactsInfoBlocksClientProps {
  infoBlocks: InfoBlock[];
}

const ContactsInfoBlocksClient = ({
  infoBlocks,
}: IContactsInfoBlocksClientProps) => {
  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {infoBlocks.map((block, index) => (
            <div key={index} className="flex flex-col">
              <h3 className="text-[2rem] md:text-[2.4rem] lg:text-[2.8rem] font-bold text-cBlack mb-4 md:mb-6">
                {block.title}
              </h3>
              <div
                className="text-[1.6rem] md:text-[1.8rem] lg:text-[2rem] text-cBlack/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactsInfoBlocksClient;
