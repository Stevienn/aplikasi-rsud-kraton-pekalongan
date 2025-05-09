"use server";

import { jwtVerify, SignJWT } from "jose";
import { createSession, deleteSession } from "./session";

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

export async function login({ userData, isDokter }: any) {
  //1. GetUser
  if (!isDokter) {
    const user = {
      ID_BPJS: userData.ID_BPJS,
      nama: userData.nama,
      jenis_kelamin: userData.jenis_kelamin,
      tanggal_lahir: userData.tanggal_lahir,
      nomor_HP: userData.nomor_HP,
      email_pasien: userData.email_pasien,
      nomor_urut: userData.nomor_urut,
    };
    await createSession({ user: user, isDokter: false });
  } else {
    const user = {
      id: userData.id,
      name: userData.name,
      image: userData.image,
      email: userData.email,
      password: userData.password,
      specialty: userData.specialty,
      schedule: userData.schedule,
    };
    await createSession({ user: user, isDokter: true });
  }

  //2. Create the cookies session
}

export async function logout() {
  await deleteSession();
}
