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

export const useCreateRegistration = () => {
  return useMutation<void, Error, IPendaftaran>({
    mutationFn: async (newRegistration) => {
      const response = await axios.post("/Pendaftaran/", newRegistration);
      return response.data;
    },
  });
};
