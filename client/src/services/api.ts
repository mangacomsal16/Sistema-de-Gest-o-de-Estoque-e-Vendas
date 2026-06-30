import axios from 'axios';

// Cliente HTTP central. O baseURL '/api' é redirecionado pelo proxy do Vite.
export const api = axios.create({
  baseURL: '/api',
});

const TOKEN_KEY = 'egv_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// Anexa o token JWT em todas as requisições.
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Em caso de 401, limpa a sessão e redireciona ao login.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Extrai a mensagem de erro vinda da API.
export function getApiError(error: unknown, fallback = 'Algo deu errado.'): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
