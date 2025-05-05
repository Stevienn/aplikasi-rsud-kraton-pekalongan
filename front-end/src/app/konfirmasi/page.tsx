"use client";

import Button from "@/components/form/Button";
import FormLayout from "@/components/form/FormLayout";
import InputField from "@/components/form/InputField";
import { useGetRegistration } from "@/hooks/api/useRegistration";
import React, { useState } from "react";

const Konfirmasi = () => {
  const { data: pendaftaran } = useGetRegistration();
  console.log(pendaftaran);
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
            // value={pendaftaran.data_pasien.nama}
            isDisabled
          />
          {/* No BPJS */}
          <InputField
            name="No BPJS"
            type="number"
            placeholder="ex: 1252****"
            customClass="mb-[10px]"
            inputWidth="w-[900px]"
          />
          {/* Jenis Kelamin */}

          {/* Tanggal Lahir */}

          {/* Nomor Handphone */}
          <InputField
            name="Nomor Handphone"
            type="text"
            placeholder="ex: 081212345678"
            customClass="mb-[10px]"
            inputWidth="w-[900px]"
          />
          {/* Email */}
          <InputField
            name="Email"
            type="email"
            placeholder="ex: stevenharta@mail.com"
            customClass="mb-[10px]"
            inputWidth="w-[900px]"
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
