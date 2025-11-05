'use client';

import { useFormik } from 'formik';
import InputMask from 'react-input-mask';
import { z } from 'zod';
import Button from '@/shared/ui/Button/Button';
import { phoneValidation } from '@/shared/utils/phoneValidation';

interface IFeedbackBlockClientProps {
  title: string;
  description: string;
  button_text: string;
}

// Схема валидации с zod
const feedbackSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z
    .string()
    .min(1, 'Введите номер телефона')
    .refine(
      (value) => {
        // Проверяем, что номер не содержит подчеркиваний (маска не заполнена)
        if (value.includes('_')) {
          return false;
        }
        return phoneValidation(value);
      },
      'Введите корректный номер телефона'
    ),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const FeedbackBlockClient = ({
  title,
  description,
  button_text,
}: IFeedbackBlockClientProps) => {
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
    onSubmit: async (values) => {
      // Коллбек формы пока пустой
      console.log('Form submitted:', values);
    },
  });

  return (
    <section className="w-full px-6 py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-cGreen rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[4rem] p-8 md:p-12 lg:p-16 xl:p-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
            <div className="absolute hidden xl:block -left-0 top-0 lg:top-8 w-[64rem] h-[64rem] md:w-[40rem] md:h-[40rem] lg:w-[50rem] lg:h-[50rem] xl:w-[64.4rem] xl:h-[67.1rem]">
              <img src="/images/dog_asset.png" alt="" className="object-contain" aria-hidden="true" />
            </div>
          </div>
          <div className="relative z-10 w-full grid grid-cols-3 ">
            <div className='hidden lg:block'></div>
            <div className='col-span-3 xl:col-span-2 flex flex-col gap-4'>
            <h2 className="text-[3.2rem] md:text-[4rem] lg:text-[4.8rem] xl:text-[5.6rem] font-bold text-white mb-4 md:mb-6">
              {title}
            </h2>

            {/* Описание */}
            <p className="text-[1.6rem] md:text-[1.8rem] lg:text-[2rem] text-white/90 mb-8 md:mb-10 lg:mb-12 ">
              {description}
            </p>

            </div>

          </div>
          <div className="relative z-10 w-full">
            {/* Заголовок */}
            
            {/* Форма */}
            <form onSubmit={formik.handleSubmit} className="space-y-4 flex flex-col md:flex-row  lg:bg-white p-4 rounded-full items-center justify-center items-start w-full md:space-y-6">
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
                    className="w-full lg:w-96 px-8 md:px-12 lg:px-16 bg-white !text-cGreen lg:!bg-cGreen lg:!text-white"
                  >
                    {button_text}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackBlockClient;

