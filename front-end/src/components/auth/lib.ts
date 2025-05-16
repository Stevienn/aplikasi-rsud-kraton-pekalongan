"use server";

import { jwtVerify, SignJWT } from "jose";
import { createSession, deleteSession } from "./session";
import { redirect } from "next/navigation";

const key = new TextEncoder().encode(process.env.SECRET);

// encrypt for creating session
export async function encrypt(payload: any) {
  const expirationTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(key);
}

// decrypt for verifying session
export async function decrypt(session: any) {
  const { payload } = await jwtVerify(session, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login({ userData }: any) {
  //1. GetUser
  const user = {
    ID_BPJS: userData.ID_BPJS,
    nama: userData.nama,
    jenis_kelamin: userData.jenis_kelamin,
    tanggal_lahir: userData.tanggal_lahir,
    nomor_HP: userData.nomor_HP,
    email_pasien: userData.email_pasien,
    nomor_urut: userData.nomor_urut,
    role: "pasien",
  };
  await createSession({ user: user });

  //2. Create the cookies session
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

export async function logoutAdmin() {
  await deleteSession();
  redirect("/admin");
}

export async function loginDoctor({ doctorData }: any) {
  const doctor = {
    id: doctorData.id,
    nama_dokter: doctorData.nama_dokter,
    email_dokter: doctorData.email_dokter,
    image_dokter: doctorData.image_dokter,
    schedule_dokter: doctorData.schedule_dokter,
    role: "dokter",
  };
  await createSession({ user: doctor });
}
