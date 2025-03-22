import { API_BASE_URL } from '@env';

export const API_URLS = {
  DESTINOS: `${API_BASE_URL}/api/destinos`,
  VUELOS: `${API_BASE_URL}/api/vuelos`,
  SEARCH_DESTINOS: `${API_BASE_URL}/api/destinos/search`,
} as const;

// Tipos para las URLs de la API
export type ApiUrlKey = keyof typeof API_URLS;
export type ApiUrlValue = typeof API_URLS[ApiUrlKey];