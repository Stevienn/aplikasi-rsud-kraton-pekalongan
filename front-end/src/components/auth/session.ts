"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, encrypt } from "./lib";

export async function createSession({ user }: any) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  (await cookies()).set("session", session, { expires, httpOnly: true });
  if (user.role === "dokter") {
    redirect("/portal-dokter");
  } else if (user.role === "pasien") {
    if (user.nomor_urut == null) {
      redirect("/keluhan");
    } else {
      redirect("/konfirmasi");
    }
  } else if (user.role === "admin") {
    redirect("/portal-admin");
  }
}

export async function verifySession() {
  //Read the cookie
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    redirect("/");
    return; // No session, redirect to login
  }
  //Decrypt the cookie
  const session = await decrypt(cookie);
  //Verify the session
  if (!session?.user) {
    redirect("/");
  }

  return { user: session.user };
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
