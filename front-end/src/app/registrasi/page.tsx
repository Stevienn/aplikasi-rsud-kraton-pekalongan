"use client";

import Button from "@/components/form/Button";
import FormLayout from "@/components/form/FormLayout";
import InputField from "@/components/form/InputField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useState } from "react";
import { redirect } from "next/navigation";

import dummyPatient from "@/components/assets/dummyPatient";
import Modal from "@/components/Modal";

interface IValidationProps {
  name: string;
  bpjs: number;
  email: string;
  phone: string;
  birth: string;
  gender: string;
}

const Registrasi = () => {
  const [dataPatient, setDataPatient] = useState(dummyPatient);

  const [name, setName] = useState("");
  const [bpjs, setBpjs] = useState<number>();
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isWarningBpjs, setIsWarningBpjs] = useState("");
  const [isWarningEmail, setIsWarningEmail] = useState("");
  const [isWarningPhone, setIsWarningPhone] = useState("");

  const [isModalConfirm, setIsModalConfirm] = useState(false);
  const [isModalLogin, setIsModalLogin] = useState(false);

  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const handleValidation = ({ bpjs, email, phone }: IValidationProps) => {
    setIsWarningBpjs("");
    setIsWarningEmail("");
    setIsWarningPhone("");

    const isRegistered = dataPatient.find((data) => bpjs == data.id);
    const isEmailRegistered = dataPatient.find((data) => email === data.email);
    const isPhoneRegistered = dataPatient.find((data) => phone === data.phone);

    if (isRegistered) {
      setIsWarningBpjs("No BPJS sudah terdaftar, silahkan melakukan login !");
      return;
    }
    if (isPhoneRegistered) {
      setIsWarningPhone(
        "Nomor handphone sudah terdaftar, silahkan memasukkan nomor lain !"
      );
    }
    if (isEmailRegistered) {
      setIsWarningEmail(
        "Email sudah terdaftar, silahkan memasukkan alamat email lain !"
      );
    }
    if (!isRegistered && !isEmailRegistered && !isPhoneRegistered) {
      setIsModalConfirm(true);
      console.log(dummyPatient);
    }
  };

  const handleSubmit = ({
    name,
    bpjs,
    email,
    phone,
    birth,
    gender,
  }: IValidationProps) => {
    const birthDate = birth.format("DD-MM-YYYY");
    const newPatient = {
      id: bpjs,
      nama: name,
      gender: gender,
      birth: birthDate,
      phone: phone,
      email: email,
    };
    dummyPatient.push(newPatient);
    setIsModalLogin(true);

    console.log(dummyPatient);
  };

  return (
    <>
      <div id="shared-modal"></div>
      {isModalLogin && (
        <Modal onClose={() => setIsModalLogin(false)} width="w-[888px]">
          <Modal.Header title="RSUD Kraton Pekalongan" />
          <Modal.Body>
            <div>
              <p className="font-medium text-[18px]">
                Registrasi berhasil, Silahkan melakukan Login !
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button placeholder="Login" onClick={() => redirect("/")} />
          </Modal.Footer>
        </Modal>
      )}
      {isModalConfirm && (
        <Modal onClose={() => setIsModalConfirm(false)} width="w-[888px]">
          <Modal.Header title="Apakah data diri sudah sesuai ?" />
          <Modal.Body>
            <div>
              <InputField
                name="Nama (Sesuai KTP) "
                type="text"
                customClass="mb-[15px]"
                inputWidth="w-full"
                value={name}
                isDisabled={true}
              />
              <InputField
                name="No BPJS"
                type="text"
                customClass="mb-[15px]"
                inputWidth="w-full"
                value={bpjs}
                isDisabled={true}
              />
              <InputField
                name="Gender"
                type="text"
                customClass="mb-[15px]"
                inputWidth="w-full"
                value={gender}
                isDisabled={true}
              />
              <InputField
                name="Tanggal Lahir"
                type="text"
                customClass="mb-[15px]"
                inputWidth="w-full"
                value={birth.format("DD-MM-YYYY")}
                isDisabled={true}
              />
              <InputField
                name="Nomor Handphone"
                type="text"
                customClass="mb-[15px]"
                inputWidth="w-full"
                value={phone}
                isDisabled={true}
              />
              <InputField
                name="Email"
                type="email"
                customClass="mb-[15px]"
                inputWidth="w-full"
                value={email}
                isDisabled={true}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              isCancel
              placeholder="Kembali"
              onClick={() => setIsModalConfirm(false)}
            />
            <Button
              placeholder="Daftar"
              onClick={() =>
                handleSubmit({ name, bpjs, email, phone, birth, gender })
              }
            />
          </Modal.Footer>
        </Modal>
      )}
      <FormLayout title="Selamat Datang !">
        <div>
          {/* Nama */}
          <InputField
            name="Nama (Sesuai KTP)"
            type="text"
            placeholder="ex: Putri Aviarta"
            customClass="mb-[10px]"
            inputWidth="w-[900px]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {/* No BPJS */}
          <InputField
            name="No BPJS"
            type="number"
            placeholder="ex: 1252****"
            customClass="mb-[10px]"
            inputWidth="w-[900px]"
            value={bpjs}
            onChange={(e) => setBpjs(parseInt(e.target.value))}
            isWarning={isWarningBpjs}
          />
          {/* Jenis Kelamin */}
          <div className="mb-[10px]">
            <p className="font-semibold text-gray-700 mb-[8px]">
              Jenis Kelamin
            </p>
            <input
              type="radio"
              id="Pria"
              name="Jenis Kelamin"
              value="Pria"
              onChange={handleGender}
            />
            <label className="ml-[5px] mr-[15px]">Pria</label>
            <input
              type="radio"
              id="Wanita"
              name="Jenis Kelamin"
              value="Wanita"
              onChange={handleGender}
            />
            <label className="ml-[5px] mr-[15px]">Wanita</label>
          </div>
          {/* Tanggal Lahir */}
          <div className="mb-[10px]">
            <p className="font-semibold text-gray-700 mb-[8px]">
              Tanggal Lahir
            </p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker onChange={(newValue) => setBirth(newValue)} />
            </LocalizationProvider>
          </div>

          {/* Nomor Handphone */}
          <InputField
            name="Nomor Handphone"
            type="text"
            placeholder="ex: 081212345678"
            customClass="mb-[10px]"
            inputWidth="w-[900px]"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            isWarning={isWarningPhone}
          />
          {/* Email */}
          <InputField
            name="Email"
            type="email"
            placeholder="ex: stevenharta@mail.com"
            customClass="mb-[10px]"
            inputWidth="w-[900px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isWarning={isWarningEmail}
          />
          <div className="flex justify-end gap-[25px] mt-[75px]">
            <Button
              isCancel
              placeholder="Kembali"
              onClick={() => redirect("/")}
            />
            <Button
              placeholder="Daftar"
              onClick={() =>
                handleValidation({ name, bpjs, email, phone, birth, gender })
              }
            />
          </div>
        </div>
      </FormLayout>
    </>
  );
};

export default Registrasi;
