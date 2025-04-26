import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetRegistration = () => {
  return useQuery({
    queryKey: ["registration"],
    queryFn: async () => {
      const response = await axios.get("/Pendaftaran");
      return response.data;
    },
  });
};
