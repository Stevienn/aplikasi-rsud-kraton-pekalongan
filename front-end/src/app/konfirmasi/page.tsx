"use client";

import { getUser } from "@/api/user";
import Button from "@/components/form/Button";
import FormLayout from "@/components/form/FormLayout";
import InputField from "@/components/form/InputField";
import { useGetRegistrationById } from "@/hooks/api/useRegistration";
import { IUserData } from "@/interface/patientInterface";
import React, { useEffect, useState } from "react";

const Konfirmasi = () => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser();
      setUserData(data);
    };
    fetchUserData();
  }, []);
  const { data: pendaftaran } = useGetRegistrationById(userData?.user.ID_BPJS);
  console.log(userData);
  console.log("data:", pendaftaran);
  return (
    <div>
      <FormLayout title="Selamat Datang !">
        <div>
          {/* Nama */}
          <InputField
            name="Nama (Sesuai KTP)"
            type="text"
            customClass="mb-[10px]"
            inputWidth="w-full"
            value={pendaftaran.data_pasien.nama}
            isDisabled
          />
          {/* No BPJS */}
          <InputField
            name="No BPJS"
            type="number"
            placeholder="ex: 1252****"
            customClass="mb-[10px]"
            inputWidth="w-[900px]"
            value={pendaftaran.data_pasien.ID_BPJS}
            isDisabled
          />
          {/* Keluhan */}
          <p className="text-gray-600 font-semibold mb-[10px]">Keluhan</p>
          <textarea
            name="Keluhan"
            id="keluhan"
            className="border-[2px] border-gray-300 px-[10px] py-[5px] rounded-[5px] mb-[10px] w-[900px] "
            value={pendaftaran.keluhan}
            disabled
          />
          {/* Dokter */}
          <InputField
            name="Nomor Handphone"
            type="text"
            placeholder="ex: 081212345678"
            customClass="mb-[10px]"
            inputWidth="w-[900px]"
            value={pendaftaran.nama_dokter}
            isDisabled
          />
          {/* Jam Praktek */}
          <InputField
            name="Email"
            type="email"
            placeholder="ex: stevenharta@mail.com"
            customClass="mb-[10px]"
            inputWidth="w-[900px]"
            value={pendaftaran.nama_dokter}
            isDisabled
          />
          <div className="flex justify-end gap-[25px] mt-[75px]">
            <Button
              isCancel
              placeholder="Kembali"
              onClick={() => redirect("/")}
            />
            <Button placeholder="Daftar" onClick={() => alert("berlum")} />
          </div>
        </div>
      </FormLayout>
    </div>
  );
};

export default Konfirmasi;
