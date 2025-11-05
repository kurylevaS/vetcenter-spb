const httpStatusCodes = {
  BAD_REQUEST: 400,
  AUTH_ERROR: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
} as const;

export const messages = {
  login: {
    [httpStatusCodes.BAD_REQUEST]: 'Проверьте введенные данные',
    [httpStatusCodes.NOT_FOUND]: 'Пользователь не найден',
    [httpStatusCodes.FORBIDDEN]: 'Вход невозможен',
  },
};
