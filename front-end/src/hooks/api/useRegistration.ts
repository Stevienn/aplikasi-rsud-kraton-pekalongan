import IPendaftaran from "@/interface/pendaftaranInterface";
import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetRegistration = () => {
  return useQuery({
    queryKey: ["registration"],
    queryFn: async () => {
      const response = await axios.get("/Pendaftaran");
      return response.data;
    },
  });
};

export const useGetRegistrationById = (id) => {
  return useQuery({
    queryKey: ["registration", "bpjs", id],
    queryFn: async () => {
      const response = await axios.get("/Pendaftaran/");
      const allData = response.data;

      return allData.find((item) => item.data_pasien.ID_BPJS === id); // return 1 object
    },
    enabled: !!id,
  });
};

export const useCreateRegistration = () => {
  return useMutation<IPendaftaran, Error, IPendaftaran>({
    mutationFn: async (newRegistration) => {
      const response = await axios.post("/Pendaftaran/", newRegistration);
      return response.data;
    },
  });
};

export const useDeleteRegistrationById = () => {
  return useMutation<IPendaftaran, Error, string>({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/Pendaftaran/${id}/`);
      return response.data;
    },
  });
};
