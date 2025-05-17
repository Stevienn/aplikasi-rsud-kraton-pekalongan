import { IDoctor, IDoctorSpc } from "@/interface/doctorInterface";
import axios from "@/lib/axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export const useGetDoctors = () => {
  return useQuery<IDoctor[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await axios.get("/Dokter");
      return response.data;
    },
  });
};

export const useGetSpecialistDoctors = () => {
  return useQuery<IDoctorSpc[]>({
    queryKey: ["specialistdoctors"],
    queryFn: async () => {
      const response = await axios.get("/DokterSpesialis");
      return response.data;
    },
  });
};

export const useGetDoctorById = (
  id: number,
  options?: UseQueryOptions<IDoctor>
) => {
  return useQuery<IDoctor>({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const response = await axios.get(`/Dokter/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useGetSpecialistDoctorsById = (
  id: number,
  options?: UseQueryOptions<IDoctorSpc>
) => {
  return useQuery<IDoctorSpc>({
    queryKey: ["specialistdoctor", id],
    queryFn: async () => {
      const response = await axios.get(`/DokterSpesialis/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<IDoctor>;
    }) => {
      const response = await axios.patch(`/Dokter/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};
