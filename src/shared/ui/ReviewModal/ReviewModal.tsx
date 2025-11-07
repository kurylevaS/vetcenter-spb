'use client';

import { useEffect } from 'react';

interface IReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  author: string;
  content: string;
  mark?: string | number;
}

const ReviewModal = ({
  isOpen,
  onClose,
  author,
  content,
  mark,
}: IReviewModalProps) => {
  // Блокируем скролл при открытии модалки
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-[2.4rem] md:rounded-[3.2rem] p-6 md:p-8 lg:p-12 max-w-[90vw] md:max-w-[80vw] lg:max-w-[70rem] max-h-[90vh] overflow-y-auto z-10"
        onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-[4.8rem] h-[4.8rem] md:w-[5.6rem] md:h-[5.6rem] flex items-center justify-center rounded-full bg-[#FAFAFA] hover:bg-cGreen/10 transition-colors"
          aria-label="Закрыть">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[2.4rem] h-[2.4rem] text-cBlack">
            <path
              d="M18 6L6 18M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Заголовок */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-[2.4rem] md:text-[3.2rem] lg:text-[4rem] font-bold text-cBlack mb-4">
            {author}
          </h3>

          {/* Рейтинг звездами */}
          {mark && (
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const markValue =
                  typeof mark === 'string' ? parseInt(mark) : mark;
                const filled = i < markValue;
                return (
                  <svg
                    key={i}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={filled ? '#82A81D' : 'none'}
                    stroke="#82A81D"
                    strokeWidth="2"
                    className="w-[2.4rem] h-[2.4rem] md:w-[3.2rem] md:h-[3.2rem]">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                );
              })}
            </div>
          )}
        </div>

        {/* Содержимое отзыва */}
        <div
          className="text-[1.6rem] md:text-[1.8rem] lg:text-[2rem] text-cBlack/70 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default ReviewModal;
