export const BASE_PATH = process.env.NODE_ENV === 'production' ? '/280CharsArentEnough' : '';
export const getImagePath = (path) => `${BASE_PATH}${path}`;