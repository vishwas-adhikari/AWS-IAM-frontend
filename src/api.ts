import axios from 'axios';

// Backend base URL, e.g. VITE_API_URL=http://localhost:8000 (no trailing slash needed)
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

// The backend returns { "error": "..." } with a message that's safe to show
export const apiErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    const message = (err.response?.data as { error?: unknown } | undefined)?.error;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
};
