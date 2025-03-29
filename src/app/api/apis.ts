import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

// Crea una instancia de Axios con configuración inicial
const api: AxiosInstance = axios.create({
  baseURL: "https://triptournow.com/api/V1", // Base URL de tu API
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada solicitud
api.interceptors.request.use(
  async (config) => {
    try {
      // Si es una solicitud de login, no intentamos obtener la sesión
      if (config.url?.includes("/login")) {
        return config; // Devolvemos la configuración sin modificar
      }

      const session = await getSession(); // Esperamos la sesión

      if (session?.user?.token) {
        config.headers.Authorization = `Bearer ${session.user.token}`;
      }
    } catch (error) {
      console.error("Error obteniendo sesión:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Manejo de respuestas y errores centralizado
const handleResponse = <T>(response: AxiosResponse<T>) => response.data;
const handleError = (error: any) => {
  console.error("API Error:", error?.response?.data || error.message);
  throw error?.response?.data || error.message;
};

// Métodos predeterminados para API requests
export const apiService = {
  get: async <T>(url: string, params?: object): Promise<T> => {
    return api.get<T>(url, { params }).then(handleResponse).catch(handleError);
  },

  post: async <T>(url: string, data?: object): Promise<T> => {
    return api.post<T>(url, data).then(handleResponse).catch(handleError);
  },

  put: async <T>(url: string, data?: object): Promise<T> => {
    return api.put<T>(url, data).then(handleResponse).catch(handleError);
  },

  delete: async <T>(url: string): Promise<T> => {
    return api.delete<T>(url).then(handleResponse).catch(handleError);
  },
};

export default api;
