import { verifySession } from "@/components/auth/session";
import { cache } from "react";

export const getUser = cache(async () => {
  const session = await verifySession();

  //Fetch user data
  return session;
});
