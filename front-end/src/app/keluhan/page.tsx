"use client";

import { getUser } from "@/api/user";
import dummyDiagnosa from "@/components/assets/dummyDiagnosa";
import { logout } from "@/components/auth/lib";
import Button from "@/components/form/Button";
import FormLayout from "@/components/form/FormLayout";
import Modal from "@/components/Modal";
import IDiagnosa from "@/interface/diagnosaInterface";
import IUser from "@/interface/patientInterface";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const Keluhan = () => {
  const [userData, setUserData] = useState<IUser | null>(null);
  const [keluhan, setKeluhan] = useState("");
  const [already, setAlready] = useState("");
  const [modalRegistration, setModalRegistration] = useState(false);
  const [diagnosa, setDiagnosa] = useState<IDiagnosa[]>(dummyDiagnosa);
  const [date, setDate] = useState("");
  const today = dayjs();
  const disabledDate = today.add(7, "day");

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleRegistration = () => {
    if (already === "Sudah") {
      const id = diagnosa.length > 0 ? diagnosa[diagnosa.length - 1].id + 1 : 1;
      if (userData?.user.id) {
        const newDiagnosa = {
          id: id,
          bpjsId: userData.user.id,
          diagnosaDate: null,
          keluhan: keluhan,
          doctorName: null,
          subjectiveDiagnosa: null,
          primaryDiagnose: null,
          secondaryDiagnose: null,
        };
        dummyDiagnosa.push(newDiagnosa);
      }

      redirect("/pilih-dokter");
    } else if (already === "Belum") {
      setModalRegistration(true);
    }
  };
  return (
    <>
      <div id="shared-modal">
        {modalRegistration && (
          <Modal width="w-[500px]">
            <Modal.Header title="Pendaftaran" />
            <Modal.Body>
              <>
                <p className="text-blue-primary font-semibold mb-[10px]">
                  Pilih Tanggal
                </p>
                <div className="mb-[6px]">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ width: "100%" }}
                      minDate={today}
                      maxDate={disabledDate}
                      onChange={(newValue) => setDate(newValue)}
                    />
                  </LocalizationProvider>
                </div>
                <p className="italic text-red-500 text-[13px] mb-[85px]">
                  *Reservasi maksimal 1 minggu ke depan dari tanggal pendaftaran
                </p>
              </>
            </Modal.Body>
            <Modal.Footer>
              <Button
                placeholder="Kembali"
                onClick={() => setModalRegistration(false)}
                isCancel
                customClass="text-[14px] px-[13px] py-[10px]"
              />
              <Button
                placeholder="Daftar"
                onClick={() => alert("SABAR BANG BELUM JADI")}
                customClass="text-[14px] px-[20px] py-[10px]"
              />
            </Modal.Footer>
          </Modal>
        )}
      </div>

      <FormLayout title="Selamat Datang !">
        <div className="font-inter-sans pt-[30px]">
          <h1 className="font-semibold text-[40px] text-gray-600 mb-[25px]">
            Keluhan
          </h1>
          <p className="text-gray-600 font-semibold mb-[10px]">
            Tulis keluhan anda !
          </p>
          <textarea
            name="Keluhan"
            id="keluhan"
            className="border-[2px] border-gray-400 px-[10px] py-[5px] rounded-[8px] mb-[25px] w-[900px] "
            placeholder="..."
            value={keluhan}
            onChange={(e) => setKeluhan(e.target.value)}
          />
          <h1 className="font-semibold text-[35px] text-gray-600 mb-[10px]">
            Apakah anda sudah memiliki dokter yang ingin dituju?
          </h1>
          <div className="mb-[130px]">
            <input
              type="radio"
              id="Pria"
              name="Dituju"
              value="Sudah"
              onChange={(event) => setAlready(event.target.value)}
            />
            <label className="ml-[5px] mr-[15px] text-gray-600 font-semibold">
              Sudah
            </label>
            <input
              type="radio"
              id="Wanita"
              name="Dituju"
              value="Belum"
              onChange={(event) => setAlready(event.target.value)}
            />
            <label className="ml-[5px] mr-[15px] text-gray-600 font-semibold">
              Belum
            </label>
          </div>
          <div className="flex justify-end gap-[30px] mb-[15px]">
            <Button placeholder="Kembali" onClick={handleLogout} isCancel />
            <Button placeholder="Daftar" onClick={handleRegistration} />
          </div>
        </div>
      </FormLayout>
    </>
  );
};

export default Keluhan;
