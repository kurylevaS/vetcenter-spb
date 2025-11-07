'use client';

import { useFormik } from 'formik';
import InputMask from 'react-input-mask';
import { z } from 'zod';
import Button from '@/shared/ui/Button/Button';
import { phoneValidation } from '@/shared/utils/phoneValidation';
import { sendToTelegram } from '@/shared/api/telegram/sendToTelegram';

interface IFeedbackFormProps {
  buttonText: string;
  onSubmit?: (values: { name: string; phone: string }) => void;
  className?: string;
}

// Схема валидации с zod
const feedbackSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z
    .string()
    .min(1, 'Введите номер телефона')
    .refine((value) => {
      // Проверяем, что номер не содержит подчеркиваний (маска не заполнена)
      if (value.includes('_')) {
        return false;
      }
      return phoneValidation(value);
    }, 'Введите корректный номер телефона'),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const FeedbackForm = ({
  buttonText,
  onSubmit,
  className = '',
}: IFeedbackFormProps) => {
  const formik = useFormik<FeedbackFormValues>({
    initialValues: {
      name: '',
      phone: '',
    },
    validate: (values) => {
      // Не валидируем пустые поля до того, как пользователь начал вводить данные
      if (!values.name && !values.phone) {
        return {};
      }

      const result = feedbackSchema.safeParse(values);

      if (!result.success) {
        const errors: Record<string, string> = {};
        if (
          result.error &&
          result.error.issues &&
          Array.isArray(result.error.issues)
        ) {
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
        if (onSubmit) {
          onSubmit(values);
        } else {
          // Отправляем в Telegram
          await sendToTelegram({
            name: values.name,
            phone: values.phone,
          });

          // Сбрасываем форму после успешной отправки
          resetForm();

          // Уведомление об успешной отправке
          alert(
            'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.'
          );
        }
      } catch (error) {
        console.error('Ошибка отправки формы:', error);
        alert(
          'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`space-y-4 flex flex-col md:flex-row lg:bg-white p-4 rounded-full items-center justify-center items-start w-full md:space-y-6 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start w-full lg:items-start">
        {/* Поле имени */}
        <div className="flex-1 w-full lg:w-auto">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Введите ваше имя"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`
              w-full px-6 py-4 md:py-5 !rounded-full
              text-[1.6rem] md:text-[1.8rem] 
              bg-white placeholder:text-cGreen/80 
              border-2 transition-colors
              border-cGreen/60
              ${
                formik.touched.name && formik.errors.name
                  ? 'border-red-500'
                  : 'border-transparent focus:border-cGreen/30'
              }
              focus:outline-none
            `}
          />
        </div>

        {/* Поле телефона */}
        <div className="flex-1 w-full lg:w-auto">
          <InputMask
            mask="+7 (999) 999-99-99"
            maskChar="_"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="tel"
            id="phone"
            name="phone"
            placeholder="Введите ваш номер телефона"
            className={`
              w-full px-6 py-4 md:py-5 !rounded-full
              text-[1.6rem] md:text-[1.8rem] 
              bg-white placeholder:text-cGreen/60 
              border-2 transition-colors
              border-cGreen/60
              ${
                formik.touched.phone && formik.errors.phone
                  ? 'border-red-500'
                  : 'border-transparent focus:border-cGreen/30'
              }
              focus:outline-none
            `}
          />
        </div>

        {/* Кнопка отправки */}
        <div className="w-full lg:w-auto">
          <Button
            type="submit"
            theme="green"
            size="3xl"
            rounded="full"
            disabled={formik.isSubmitting}
            className="w-full lg:w-96 px-8 md:px-12 lg:px-16 bg-white !text-cGreen lg:!bg-cGreen lg:!text-white">
            {buttonText}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FeedbackForm;
