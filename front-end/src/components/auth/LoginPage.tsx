"use client";

import React, { useState } from "react";

import Image from "next/image";
import RumahSakit from "../../../public/images/RumahSakit.jpg";
import InputField from "@/components/form/InputField";
import Button from "@/components/form/Button";
import Link from "next/link";
import Footer from "@/components/Footer";
import { redirect, useRouter } from "next/navigation";

import dummyPatient from "@/components/assets/dummyPatient";
import dummyDoctorUmum from "@/components/assets/dummyDoctorUmum";
import { login } from "./lib";
import { useGetDoctors } from "@/hooks/api/useDoctor";
import { useGetUsers } from "@/hooks/api/useUser";
import { useGetRegistration } from "@/hooks/api/useRegistration";

interface ILoginPageProps {
  isAdmin?: boolean;
}

const LoginPage = ({ isAdmin }: ILoginPageProps) => {
  const { data: dataPendaftaran } = useGetRegistration();
  console.log(dataPendaftaran);

  // const dataPatient = dummyPatient;
  const { data: dataPatient } = useGetUsers();
  const { data: dataDoctorUmum } = useGetDoctors();

  console.log(dataDoctorUmum);
  console.log(dataPatient);
  const doctorUmum = dummyDoctorUmum;
  const [input, setInput] = useState("");
  const [validate, setValidate] = useState("");
  const [isWarningInput, setIsWarningInput] = useState("");
  const [isWarningValidate, setIsWarningValidate] = useState("");

  const handleValidationPatient = async (input, validate) => {
    setIsWarningInput("");
    setIsWarningValidate("");

    const patientData = dataPatient.find((data) => input == data.id);

    if (!patientData) {
      setIsWarningInput("No BPJS belum terdaftar !");
    } else {
      if (input == patientData.id && validate == patientData.nama) {
        await login({ userData: patientData, isDokter: false });
      } else if (input == patientData.id && validate !== patientData.nama) {
        setIsWarningValidate("Nama yang anda masukkan tidak sesuai");
      }
    }
  };

  const handleValidationAdmin = async (input, validate) => {
    setIsWarningInput("");
    setIsWarningValidate("");

    const doctorData = doctorUmum.find((data) => input == data.email);

    if (doctorData) {
      if (input == doctorData.email && validate == doctorData.password) {
        await login({ userData: doctorData, isDokter: true });
      } else if (
        input == doctorData.email &&
        validate !== doctorData.password
      ) {
        setIsWarningValidate("Password yang anda masukkan salah");
      }
    } else if (!doctorData) {
      setIsWarningInput("Email yang anda masukkan salah !");
    }
  };

  return (
    <div className="grid grid-cols-2 font-inter-sans">
      <div>
        <div className="px-[65px] pt-[160px]">
          <Image
            src="/images/logo/RSUDKraton.png"
            alt="Logo"
            width={264}
            height={143}
          />
          <h1 className="font-bold text-[45px] text-blue-primary mb-[-20px]">
            RSUD KRATON
          </h1>
          <h1 className="font-bold text-[45px] text-blue-primary">
            PEKALONGAN
          </h1>
          {isAdmin ? (
            <>
              <h1 className="font-light text-[32px] mt-[-10px] mb-[15px] text-blue-primary">
                PORTAL ADMIN
              </h1>
              <form>
                <InputField
                  name="Email"
                  type="email"
                  placeholder="ex: chiesamutiara@gmail.com"
                  customClass="mb-[30px]"
                  inputWidth="w-[530px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  isWarning={isWarningInput}
                />
                <InputField
                  name="Password"
                  type="password"
                  placeholder="********"
                  customClass="mb-[30px]"
                  inputWidth="w-[530px]"
                  value={validate}
                  onChange={(e) => setValidate(e.target.value)}
                  isWarning={isWarningValidate}
                />

                <Button
                  placeholder="Masuk"
                  onClick={() => handleValidationAdmin(input, validate)}
                />
              </form>
            </>
          ) : (
            <>
              <div>
                <InputField
                  name="No BPJS"
                  type="text"
                  placeholder="ex: 000125xxx"
                  customClass="mb-[30px]"
                  inputWidth="w-[530px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  isWarning={isWarningInput}
                />
                <InputField
                  name="Nama (Sesuai KTP)"
                  type="text"
                  placeholder="ex: Kevin Safaat"
                  customClass="mb-[30px]"
                  inputWidth="w-[530px]"
                  value={validate}
                  onChange={(e) => setValidate(e.target.value)}
                  isWarning={isWarningValidate}
                />

                <Button
                  placeholder="Masuk"
                  onClick={() => handleValidationPatient(input, validate)}
                />
              </div>
              <div className="flex mt-[10px]">
                <p className="text-blue-primary font-semibold">
                  {"Belum pernah mendaftar? Silahkan melakukan "}
                  <Link
                    href="/registrasi"
                    className="text-blue-primary font-bold cursor-pointer hover:text-blue-secondary underline"
                  >
                    Registrasi
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
      <div>
        <Image
          src={RumahSakit}
          alt="Rumah Sakit"
          style={{ width: "100%", height: "100vh" }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
