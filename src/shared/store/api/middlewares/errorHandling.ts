import { MiddlewareAPI, isRejectedWithValue } from '@reduxjs/toolkit';
import { messages } from './errorMessages';
import { api } from '../api';

export const rtkQueryErrorLogger =
  /* eslint-disable @typescript-eslint/no-unused-vars */
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const error = action.error;
      const statusCode = action?.payload?.status;
      const { endpointName } = action.meta.arg;

      // При использовании process.env.NODE_ENV === 'development' логироваться будет только в режиме dev
      if (error && statusCode && process.env.NODE_ENV === 'development') {
        if (statusCode === 500) {
          console.warn('Internal Server Error (500)');
          // toast.error('Возникла ошибка', { theme: 'dark', type: 'error' });
        } else if (statusCode !== 401) {
          reportError(endpointName, statusCode, messages);
        }
      }
    }
    return next(action);
  };

function reportError(queryName: keyof typeof api, status: number, messages) {
  console.log('query: ' + queryName);
  console.log('statusCode: ' + status);

  /*
  Если для такого эндпоинта и кода ошибки есть сообщение в файле errorMessages, то выводим его в консоль или Тоаст, 
  если для такого случая обработки нет, то делаем что-то другое в блоке else 
  Таким же образом можно логировать и ответы с кодами 200 и 201 (например, "Пост создан" или "Заявка оставлена" и т.д. и т.п)
  ВАЖНО! Бэкенд должен отдавать корректные коды статусов ответов!
  */

  if (messages[queryName] && messages[queryName][status]) {
    console.error(queryName, messages[queryName][status]);
    // toast.error(messages[queryName][status], { theme: 'dark', type: 'error' });
  } else {
    // toast.error('Неизвестная ошибка', { theme: 'dark', type: 'error' });
  }
}
