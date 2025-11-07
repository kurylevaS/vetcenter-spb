import { getContactsPage } from '@/shared/api/pages/contacts';
import MapBlock from '@/widgets/MapBlock/MapBlock';
import ContactsInfoBlocks from '@/widgets/ContactsInfoBlocks/ContactsInfoBlocks';
import ContactsFeedbackBlock from '@/widgets/ContactsFeedbackBlock/ContactsFeedbackBlock';

export default async function ContactsPage() {
  const pageData = await getContactsPage();

  if (!pageData) {
    return null;
  }

  return (
    <>
      <main>
        {/* Заголовок страницы */}
        <section className="w-full px-6 bg-white pt-12 md:pt-16 lg:pt-20 xl:pt-24 pb-6 md:pb-8">
          <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
            <h1 className="text-[3.2rem] md:text-[4rem] lg:text-[5rem] xl:text-[6rem] font-bold text-cBlack">
              {pageData.title}
            </h1>
          </div>
        </section>

        {/* Карта */}
        <MapBlock />

        {/* Информационные блоки */}
        <ContactsInfoBlocks infoBlocks={pageData.info_blocks} />

        {/* Форма обратной связи */}
        <ContactsFeedbackBlock feedbackBlock={pageData.feedback_block} />
      </main>
    </>
  );
}
