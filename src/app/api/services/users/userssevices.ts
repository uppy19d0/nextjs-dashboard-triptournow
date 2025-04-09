import { User } from "@/models/users/users";
import { apiService } from "../apis";

export const getUsers = async (): Promise<User[]> => {
  const response = await apiService.get<{ status: string; data: User[] }>(
    "/admin/users"
  );
  return response.data;
};

export const changeVerificationStatus = async (
  id: number,
  status: string
): Promise<string> => {
  const response = await apiService.post<{ status: string; data: string }>(
    "/admin/verificationStatus",
    {
      id,
      status,
    }
  );
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await apiService.get<{ status: string; data: User }>(
    `/admin/user/${id}`
  );
  return response.data;
};


export const updateUser = async (id: string | number, data: Partial<User>) => {
  try {
    const response = await apiService.put<{ status: string; data: User }>(
      `/admin/users/${id}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error en updateUser:", error);
    throw error;
  }
};
