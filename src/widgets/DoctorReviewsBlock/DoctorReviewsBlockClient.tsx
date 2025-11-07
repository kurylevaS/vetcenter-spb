'use client';

import { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import Link from 'next/link';
import { ServiceReview } from '@/shared/api/services/types';
import ReviewModal from '@/shared/ui/ReviewModal/ReviewModal';

import 'swiper/css';
import 'swiper/css/navigation';

// Функция для обрезки HTML текста до первых N слов
const truncateHTMLText = (html: string, wordLimit: number = 20): { truncated: string; isTruncated: boolean } => {
  if (!html) return { truncated: '', isTruncated: false };

  // Создаем временный элемент для парсинга HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Получаем текстовое содержимое
  const text = tempDiv.textContent || tempDiv.innerText || '';
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  
  if (words.length <= wordLimit) {
    return { truncated: html, isTruncated: false };
  }
  
  // Для HTML с тегами: находим первый текстовый узел и обрезаем его
  const walker = document.createTreeWalker(
    tempDiv,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let wordCount = 0;
  let found = false;
  
  while (walker.nextNode() && !found) {
    const node = walker.currentNode;
    if (node.textContent) {
      const nodeWords = node.textContent.trim().split(/\s+/).filter(w => w.length > 0);
      
      if (wordCount + nodeWords.length <= wordLimit) {
        wordCount += nodeWords.length;
      } else {
        // Обрезаем этот узел
        const remainingWords = wordLimit - wordCount;
        const truncatedNodeText = nodeWords.slice(0, remainingWords).join(' ');
        node.textContent = truncatedNodeText + '...';
        found = true;
        
        // Удаляем все последующие текстовые узлы
        while (walker.nextNode()) {
          const nextNode = walker.currentNode;
          if (nextNode.textContent) {
            nextNode.textContent = '';
          }
        }
      }
    }
  }
  
  return { truncated: tempDiv.innerHTML, isTruncated: true };
};

interface IDoctorReviewsBlockClientProps {
  reviews: ServiceReview[];
}

const DoctorReviewsBlockClient = ({ reviews }: IDoctorReviewsBlockClientProps) => {
  const [selectedReview, setSelectedReview] = useState<{
    author: string;
    content: string;
    mark?: string | number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const processedReviews = useMemo(() => {
    if (!mounted) {
      return reviews.map(review => ({
        ...review,
        truncatedHTML: review.review.content,
        isTruncated: false,
      }));
    }

    return reviews.map(review => {
      const { truncated, isTruncated } = truncateHTMLText(review.review.content, 20);
      return {
        ...review,
        truncatedHTML: truncated,
        isTruncated,
      };
    });
  }, [reviews, mounted]);

  const handleReadMore = (review: ServiceReview) => {
    setSelectedReview({
      author: review.review.author,
      content: review.review.content,
      mark: review.review.mark,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        <h2 className="text-[2.2rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4.6rem] font-bold text-cBlack mb-8 md:mb-24">
          Отзывы о враче
        </h2>

        <div className="grid grid-cols-5 gap-8">
          <div className="relative col-span-5 md:col-span-4">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 32,
                },
              }}
              loop={reviews.length > 3}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: '.doctor-reviews-swiper-button-next',
                prevEl: '.doctor-reviews-swiper-button-prev',
              }}
              className="doctor-reviews-swiper"
            >
              {processedReviews.map((reviewItem, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-[#FAFAFA] rounded-[2.4rem] md:rounded-[3.2rem] p-6 md:p-8 h-full">
                    <div className="flex flex-col h-full">
                      <h3 className="text-[2rem] md:text-[2.4rem] font-bold text-cBlack mb-4">
                        {reviewItem.review.author}
                      </h3>
                      <div className="text-[1.6rem] md:text-[1.8rem] text-cBlack/70 mb-6 flex-grow">
                        {reviewItem.isTruncated ? (
                          <>
                            <div
                              dangerouslySetInnerHTML={{ __html: reviewItem.truncatedHTML }}
                              className="mb-2"
                            />
                            <button
                              onClick={() => handleReadMore(reviewItem)}
                              className="text-cGreen hover:text-cGreen/80 font-semibold transition-colors"
                            >
                              Читать далее
                            </button>
                          </>
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: reviewItem.review.content }} />
                        )}
                      </div>
                      {/* Рейтинг звездами */}
                      {reviewItem.review.mark && (
                        <div className="flex gap-2">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const mark = typeof reviewItem.review.mark === 'string'
                              ? parseInt(reviewItem.review.mark)
                              : reviewItem.review.mark;
                            const filled = i < mark;
                            return (
                              <svg
                                key={i}
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill={filled ? '#82A81D' : 'none'}
                                stroke="#82A81D"
                                strokeWidth="2"
                                className="w-[2.4rem] h-[2.4rem]"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Стрелки навигации */}
            <button className="doctor-reviews-swiper-button-prev absolute left-[-2.4rem] md:left-[-3.2rem] top-1/2 -translate-y-1/2 z-10 w-[4.8rem] h-[4.8rem] md:w-[5.6rem] md:h-[5.6rem] bg-white rounded-full shadow-lg flex items-center justify-center transition-colors hidden lg:flex">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-[2.4rem] h-[2.4rem] text-cGreen"
              >
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="doctor-reviews-swiper-button-next absolute right-[-2.4rem] md:right-[-3.2rem] top-1/2 -translate-y-1/2 z-10 w-[4.8rem] h-[4.8rem] md:w-[5.6rem] md:h-[5.6rem] bg-white rounded-full shadow-lg flex items-center justify-center transition-colors hidden lg:flex">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-[2.4rem] h-[2.4rem] text-cGreen"
              >
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="h-full col-span-5 md:col-span-1">
              <Link
                href="#feedback"
                className="flex flex-col justify-center lg:justify-between h-full items-center gap-4 bg-cGreen rounded-[2.4rem] md:rounded-[3.2rem] p-6 lg:p-16 text-white hover:bg-cGreen/90 transition-colors shadow-lg w-full md:w-auto"
              >
                <span className="text-[1.8rem] text-center lg:text-left lg:text-[2.4rem] font-bold">
                  Оставьте свой отзыв
                </span>
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="md:w-[7.2rem] md:h-[7.2rem] w-[4.8rem] h-[4.8rem]"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                
              </Link>
            </div>
        </div>

        {/* Модалка с полным отзывом */}
        {selectedReview && (
          <ReviewModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            author={selectedReview.author}
            content={selectedReview.content}
            mark={selectedReview.mark}
          />
        )}
      </div>
    </section>
  );
};

export default DoctorReviewsBlockClient;

