"use client";

import React, { useState } from "react";

import Image from "next/image";
import RumahSakit from "../../../public/images/RumahSakit.jpg";
import InputField from "@/components/form/InputField";
import Button from "@/components/form/Button";
import Link from "next/link";
import Footer from "@/components/Footer";

import { login, loginAdmin, loginDoctor } from "./lib";
import { useGetDoctors, useGetSpecialistDoctors } from "@/hooks/api/useDoctor";
import { useGetUsers } from "@/hooks/api/useUser";
import { useGetAdmin } from "@/hooks/api/useAdmin";

interface ILoginPageProps {
  isAdmin?: boolean;
}

const LoginPage = ({ isAdmin }: ILoginPageProps) => {
  // const dataPatient = dummyPatient;
  const { data: dataPatient } = useGetUsers();
  const { data: dataDoctorUmum } = useGetDoctors();
  const { data: dataDoctorSpc } = useGetSpecialistDoctors();
  const { data: dataAdmin } = useGetAdmin();

  const [input, setInput] = useState("");
  const [validate, setValidate] = useState("");
  const [isWarningInput, setIsWarningInput] = useState("");
  const [isWarningValidate, setIsWarningValidate] = useState("");

  const handleValidationPatient = async (input, validate) => {
    setIsWarningInput("");
    setIsWarningValidate("");

    const patientData = dataPatient.find((data) => input == data.ID_BPJS);

    if (!patientData) {
      setIsWarningInput("No BPJS belum terdaftar !");
    } else {
      if (input == patientData.ID_BPJS && validate == patientData.nama) {
        await login({ userData: patientData });
      } else if (
        input == patientData.ID_BPJS &&
        validate !== patientData.nama
      ) {
        setIsWarningValidate("Nama yang anda masukkan tidak sesuai");
      }
    }
  };

  const handleValidationAdmin = async (input, validate) => {
    setIsWarningInput("");
    setIsWarningValidate("");

    const doctorData = dataDoctorUmum?.find(
      (data) => input == data.email_dokter
    );

    const doctorDataSpcValidate = dataDoctorSpc?.find(
      (data) => input == data.email_dokter
    );

    const adminData = dataAdmin?.find((data) => input == data.email_perawat);

    if (doctorData) {
      if (
        input == doctorData.email_dokter &&
        validate == doctorData.password_dokter
      ) {
        await loginDoctor({ doctorData: doctorData });
      } else if (
        input == doctorData.email_dokter &&
        validate !== doctorData.password_dokter
      ) {
        setIsWarningValidate("Password yang anda masukkan salah");
      }
    } else if (doctorDataSpcValidate) {
      if (
        input == doctorDataSpcValidate.email_dokter &&
        validate == doctorDataSpcValidate.password_dokter
      ) {
        await loginDoctor({ doctorData: doctorDataSpcValidate });
      } else if (
        input == doctorDataSpcValidate.email_dokter &&
        validate !== doctorDataSpcValidate.password_dokter
      ) {
        setIsWarningValidate("Password yang anda masukkan salah");
      }
    } else if (adminData) {
      if (
        input == adminData.email_perawat &&
        validate == adminData.password_perawat
      ) {
        await loginAdmin({ adminData: adminData });
      } else if (
        input == adminData.email_perawat &&
        validate !== adminData.password_perawat
      ) {
        setIsWarningValidate("Password yang anda masukkan salah");
      }
    } else if (!doctorData || !doctorDataSpcValidate || !adminData) {
      setIsWarningInput("Email yang anda masukkan salah !");
    }
  };

  return (
    <div className="md:grid md:grid-cols-2 font-inter-sans">
      <div>
        <div className="px-[65px] md:pt-[155px] pt-[100px]">
          <Image
            src="/images/logo/RSUDKraton.png"
            alt="Logo"
            width={264}
            height={143}
          />
          <h1 className="font-bold text-[45px] mt-[10px] text-gray-800 mb-[-20px]">
            RSUD KRATON
          </h1>
          <h1 className="font-bold text-[45px] text-blue-primary">
            PEKALONGAN
          </h1>
          {isAdmin ? (
            <>
              <h1 className="font-light text-[32px] mt-[-10px] mb-[15px] text-blue-secondary">
                PORTAL ADMIN
              </h1>
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
            </>
          ) : (
            <>
              <div>
                <InputField
                  name="No BPJS"
                  type="text"
                  placeholder="ex: 000125xxx"
                  customClass="mb-[30px]"
                  inputWidth="md:w-[530px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  isWarning={isWarningInput}
                />
                <InputField
                  name="Nama (Sesuai KTP)"
                  type="text"
                  placeholder="ex: Kevin Safaat"
                  customClass="mb-[30px]"
                  inputWidth="md:w-[530px]"
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
                <p className="text-gray-800 font-semibold">
                  {"Belum pernah mendaftar? Silahkan melakukan "}
                  <Link
                    href="/registrasi"
                    className="text-orange-primary font-bold cursor-pointer hover:text-blue-secondary underline"
                  >
                    Registrasi
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
        <div className="block md:hidden">
          <Footer isFull />
        </div>

        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
      <div className="hidden md:block">
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
