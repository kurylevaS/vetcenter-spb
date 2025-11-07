'use client';

import { useFormik } from 'formik';
import InputMask from 'react-input-mask';
import { z } from 'zod';
import { useAppDispatch } from '@/shared/store/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { feedbackModalActions, feedbackModalSelectors } from '@/shared/store/feedbackModalSlice';
import { sendToTelegram, TelegramFormData } from '@/shared/api/telegram/sendToTelegram';
import { phoneValidation } from '@/shared/utils/phoneValidation';
import Button from '@/shared/ui/Button/Button';
import { useEffect } from 'react';

const petOptions = [
  { value: '', label: 'Выберите питомца' },
  { value: 'Кошка', label: 'Кошка' },
  { value: 'Собака', label: 'Собака' },
  { value: 'Птица', label: 'Птица' },
  { value: 'Рептилия', label: 'Рептилия' },
  { value: 'Грызун', label: 'Грызун' },
  { value: 'Другое', label: 'Другое' },
];

const feedbackSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z
    .string()
    .min(1, 'Введите номер телефона')
    .refine(
      (value) => {
        if (value.includes('_')) {
          return false;
        }
        return phoneValidation(value);
      },
      'Введите корректный номер телефона'
    ),
  pet: z.string().optional(),
  comment: z.string().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const FeedbackModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(feedbackModalSelectors.isOpen);
  const metadata = useAppSelector(feedbackModalSelectors.metadata);

  const formik = useFormik<FeedbackFormValues>({
    initialValues: {
      name: '',
      phone: '',
      pet: '',
      comment: '',
    },
    validate: (values) => {
      if (!values.name && !values.phone) {
        return {};
      }

      const result = feedbackSchema.safeParse(values);
      
      if (!result.success) {
        const errors: Record<string, string> = {};
        if (result.error && result.error.issues && Array.isArray(result.error.issues)) {
          result.error.issues.forEach((err: z.ZodIssue) => {
            if (err.path && err.path.length > 0 && err.path[0]) {
              errors[err.path[0].toString()] = err.message;
            }
          });
        }
        return errors;
      }
      
      return {};
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        dispatch(feedbackModalActions.setLoading(true));
        const telegramData: TelegramFormData = {
          name: values.name,
          phone: values.phone,
          ...(values.pet && { pet: values.pet }),
          ...(values.comment && { comment: values.comment }),
          ...(metadata?.doctor && { doctor: metadata.doctor }),
          ...(metadata?.service_name && { service_name: metadata.service_name }),
        };

        await sendToTelegram(telegramData);
        
        // Закрываем модальное окно и сбрасываем форму
        resetForm();
        dispatch(feedbackModalActions.closeModal());
        
        // Можно добавить уведомление об успешной отправке
        alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
      } catch (error) {
        console.error('Ошибка отправки формы:', error);
        alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
      } finally {
        setSubmitting(false);
        dispatch(feedbackModalActions.setLoading(false));
      }
    },
  });

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(feedbackModalActions.closeModal());
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, dispatch]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      dispatch(feedbackModalActions.closeModal());
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-6 lg:p-8"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-[2.4rem] md:rounded-[3.2rem] w-full max-w-[60rem] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 md:p-8 lg:p-12">
          {/* Заголовок */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-[2.4rem] md:text-[3.2rem] lg:text-[4rem] font-bold text-cBlack">
              Записаться на приём
            </h2>
            <button
              onClick={() => dispatch(feedbackModalActions.closeModal())}
              className="text-cBlack/70 hover:text-cBlack transition-colors p-2"
              aria-label="Закрыть"
            >
              <svg
                className="w-8 h-8 md:w-10 md:h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Форма */}
          <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-6">
            {/* ФИО */}
            <div>
              <label
                htmlFor="modal-name"
                className="block text-[1.4rem] md:text-[1.6rem] font-medium text-cBlack mb-2"
              >
                ФИО <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="modal-name"
                name="name"
                placeholder="Введите ваше ФИО"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`
                  w-full px-6 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.6rem]
                  text-[1.6rem] md:text-[1.8rem] 
                  bg-[#FAFAFA] placeholder:text-cBlack/40 
                  border-2 transition-colors
                  ${
                    formik.touched.name && formik.errors.name
                      ? 'border-red-500'
                      : 'border-transparent focus:border-cGreen/30'
                  }
                  focus:outline-none focus:bg-white
                `}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-2 text-[1.2rem] md:text-[1.4rem] text-red-500">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Телефон */}
            <div>
              <label
                htmlFor="modal-phone"
                className="block text-[1.4rem] md:text-[1.6rem] font-medium text-cBlack mb-2"
              >
                Номер телефона <span className="text-red-500">*</span>
              </label>
              <InputMask
                mask="+7 (999) 999-99-99"
                maskChar="_"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="tel"
                id="modal-phone"
                name="phone"
                placeholder="+7 (999) 999-99-99"
                className={`
                  w-full px-6 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.6rem]
                  text-[1.6rem] md:text-[1.8rem] 
                  bg-[#FAFAFA] placeholder:text-cBlack/40 
                  border-2 transition-colors
                  ${
                    formik.touched.phone && formik.errors.phone
                      ? 'border-red-500'
                      : 'border-transparent focus:border-cGreen/30'
                  }
                  focus:outline-none focus:bg-white
                `}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-2 text-[1.2rem] md:text-[1.4rem] text-red-500">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            {/* Ваш питомец */}
            <div>
              <label
                htmlFor="modal-pet"
                className="block text-[1.4rem] md:text-[1.6rem] font-medium text-cBlack mb-2"
              >
                Ваш питомец
              </label>
              <select
                id="modal-pet"
                name="pet"
                value={formik.values.pet}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`
                  w-full px-6 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.6rem]
                  text-[1.6rem] md:text-[1.8rem] 
                  bg-[#FAFAFA] text-cBlack
                  border-2 transition-colors
                  border-transparent focus:border-cGreen/30
                  focus:outline-none focus:bg-white
                  appearance-none
                  bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234C4C4C' d='M6 9L1 4h10z'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1.2rem]
                `}
              >
                {petOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Комментарий */}
            <div>
              <label
                htmlFor="modal-comment"
                className="block text-[1.4rem] md:text-[1.6rem] font-medium text-cBlack mb-2"
              >
                Комментарий
              </label>
              <textarea
                id="modal-comment"
                name="comment"
                placeholder="Опишите вашу проблему или вопрос"
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className={`
                  w-full px-6 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.6rem]
                  text-[1.6rem] md:text-[1.8rem] 
                  bg-[#FAFAFA] placeholder:text-cBlack/40 
                  border-2 transition-colors
                  border-transparent focus:border-cGreen/30
                  focus:outline-none focus:bg-white
                  resize-none
                `}
              />
            </div>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4">
              <Button
                type="submit"
                theme="green"
                size="2xl"
                rounded="full"
                disabled={formik.isSubmitting}
                className="flex-1"
                isLoading={formik.isSubmitting}
              >
                Отправить заявку
              </Button>
              <Button
                type="button"
                theme="white"
                size="2xl"
                rounded="full"
                onClick={() => dispatch(feedbackModalActions.closeModal())}
                className="flex-1 border-2 border-cGreen/30"
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;

