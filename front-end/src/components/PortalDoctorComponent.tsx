import React, { useEffect, useMemo, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import CustomTable from "./CustomTable";
import { redirect } from "next/navigation";

const columns = [
  {
    id: "id",
    label: "No Urut",
    width: 100,
  },
  {
    id: "namaPasien",
    label: "Nama Pasien",
    width: 300,
  },
  {
    id: "noBPJS",
    label: "No BPJS",
    width: 300,
  },
  {
    id: "jenisKelamin",
    label: "Jenis Kelamin",
    width: 300,
  },
  {
    id: "tanggalLahir",
    label: "Tanggal Lahir",
    width: 300,
  },
  {
    id: "aksiDiag",
    label: "Aksi",
    width: 300,
  },
];

dayjs.locale("id");

const PortalDoctorComponent = ({ doctorData, doctor, refetchDoctor }: any) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSession, setSelectedSession] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [dataPatient, setIsDataPatient] = useState();
  const [keluhan, setKeluhan] = useState("");

  const today = selectedDate.format("dddd");
  const disabled = dayjs();

  const disabledDate = disabled.add(7, "day");

  const handleChangeDate = (newValue) => {
    setSelectedDate(newValue);
  };

  const todayPatient = doctor?.schedule_dokter.find(
    (data) => today == data.hari
  );

  const todaySessionPatient = todayPatient?.hari_praktek_set.find(
    (data) => selectedSession == data.jam_sesi
  );

  const rows = useMemo(() => {
    if (!todaySessionPatient) return [];
    return todaySessionPatient.data_pendaftaran.map((data) => ({
      id: data.data_pasien?.nomor_urut,
      namaPasien: data.data_pasien?.nama,
      noBPJS: data.data_pasien?.ID_BPJS,
      jenisKelamin: data.data_pasien?.jenis_kelamin,
      tanggalLahir: data.data_pasien?.tanggal_lahir,
      keluhan: data.keluhan,
    }));
  }, [todaySessionPatient]);

  const SessionComponent = ({ session }) => {
    const getDay = session.find((data) => today == data.hari);

    const getSession = getDay?.hari_praktek_set;

    // Bikin Default Value
    useEffect(() => {
      if (getSession?.length > 0 && !selectedSession) {
        setSelectedSession(getSession[0].jam_sesi);
      }
    }, [getSession, selectedSession]);

    return (
      <div>
        <p className="font-semibold mb-[5px] font-inter-sans text-[20px]">
          Pilih Sesi
        </p>
        <FormControl fullWidth sx={{ backgroundColor: "white" }}>
          <Select
            value={selectedSession}
            onChange={(event) => setSelectedSession(event?.target.value)}
          >
            {getSession?.length > 0 ? (
              getSession.map((sessionData) => (
                <MenuItem key={sessionData.id} value={sessionData.jam_sesi}>
                  {sessionData.jam_sesi}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                Tidak ada sesi tersedia
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
    );
  };

  const handleAction = (patientId: string, keluhan: string) => {
    setKeluhan(keluhan);
    todaySessionPatient?.data_pendaftaran.forEach((data) => {
      if (data.data_pasien?.ID_BPJS == patientId) {
        setIsDataPatient(data.data_pasien);
      }
    });
    redirect(`/portal-dokter/${patientId}`);
  };

  return (
    <div
      className="bg-light-primary px-[55px] py-[30px] h-[88dvh] font-inria-sans "
      id="shared-modal"
    >
      <div className="mb-[20px] flex justify-between">
        <SessionComponent session={doctor?.schedule_dokter} />
        <div>
          <p className="font-semibold mb-[5px] font-inter-sans text-[20px]">
            Pilih Tanggal
          </p>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <DatePicker
              value={selectedDate}
              onChange={(newValue) => handleChangeDate(newValue)}
              minDate={disabled}
              maxDate={disabledDate}
              sx={{ backgroundColor: "white" }}
            />
          </LocalizationProvider>
        </div>
      </div>

      <CustomTable rows={rows} columns={columns} handleAction={handleAction} />
    </div>
  );
};

export default PortalDoctorComponent;
