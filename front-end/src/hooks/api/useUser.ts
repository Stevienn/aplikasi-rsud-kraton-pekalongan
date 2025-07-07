import { IUser } from "@/interface/patientInterface";
import axios from "@/lib/axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get("/Pasien");
      return response.data;
    },
  });
};

export const useGetUserById = (
  id: number,
  options?: UseQueryOptions<IUser>
) => {
  return useQuery<IUser>({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const response = await axios.get(`/Pasien/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.patch(`/Pasien/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useCreateUser = () => {
  return useMutation<void, Error, IUser>({
    mutationFn: async (newUser) => {
      const response = await axios.post("/Pasien/", newUser);
      return response.data;
    },
  });
};
