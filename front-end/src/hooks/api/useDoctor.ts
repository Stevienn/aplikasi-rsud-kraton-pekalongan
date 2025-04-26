import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await axios.get("/Dokter");
      return response.data;
    },
  });
};
