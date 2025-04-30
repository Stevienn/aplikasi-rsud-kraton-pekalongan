import { IUser } from "@/interface/patientInterface";
import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get("/Pasien");
      return response.data;
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
