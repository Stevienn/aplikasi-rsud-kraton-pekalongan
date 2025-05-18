import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAdmin = () => {
  return useQuery({
    queryKey: ["admin"],
    queryFn: async () => {
      const response = await axios.get("/Perawat");
      return response.data;
    },
  });
};
