import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import CustomTable from "./CustomTable";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useGetDoctors, useGetSpecialistDoctors } from "@/hooks/api/useDoctor";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useGetUsers } from "@/hooks/api/useUser";
import { useGetSchedule } from "@/hooks/api/useSchedule";

const columns = [
  {
    id: "id",
    label: "No Urut",
    width: 100,
  },
  {
    id: "namaPasien",
    label: "Nama Pasien",
    width: 200,
  },
  {
    id: "noBPJS",
    label: "No BPJS",
    width: 200,
  },
  {
    id: "jenisKelamin",
    label: "Jenis Kelamin",
    width: 200,
  },
  {
    id: "tanggalLahir",
    label: "Tanggal Lahir",
    width: 200,
  },
  {
    id: "nomorHP",
    label: "Nomor HP",
    width: 200,
  },
  {
    id: "email",
    label: "Email",
    width: 200,
  },
  {
    id: "status",
    label: "Status",
    width: 200,
  },
];

dayjs.locale("id");

const PortalAdminComponent = () => {
  const { data: doctorsData } = useGetDoctors();
  const { data: historyData } = useGetUsers();
  const { data: scheduleData } = useGetSchedule();

  const [selectedDoctor, setSelectedDoctor] = useState();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const today = selectedDate.format("dddd");

  const handleChangeDate = (newValue) => {
    setSelectedDate(newValue);
  };

  const rows = useMemo(() => {
    if (!doctorsData || !historyData || !selectedDate) return [];

    const result = [];

    // Ambil data dari jadwal dokter
    scheduleData?.forEach((data) => {
      if (
        selectedDoctor &&
        data.dokter_umum.nama_dokter !== selectedDoctor.nama_dokter
      )
        return;

      if (data.hari?.hari !== today) return;

      data.data_pendaftaran?.forEach((dp) => {
        if (dp.tanggal_konsultasi === selectedDate.format("YYYY-MM-DD")) {
          result.push({
            id: dp.data_pasien?.nomor_urut,
            namaPasien: dp.data_pasien?.nama,
            noBPJS: dp.data_pasien?.ID_BPJS,
            jenisKelamin: dp.data_pasien?.jenis_kelamin,
            tanggalLahir: dp.data_pasien?.tanggal_lahir,
            nomorHP: dp.data_pasien?.nomor_HP,
            email: dp.data_pasien?.email_pasien,
            tanggalKonsultasi: dp.tanggal_konsultasi,
            dokter: dp.nama_dokter,
            status: "PENDING",
          });
        }
      });
    });

    // Ambil data dari histori pasien
    historyData.forEach((entry) => {
      entry.rekap_medis?.forEach((hist) => {
        const tanggal = hist.tanggal_konsultasi;
        const dokter = hist.data_dokter?.nama_dokter;

        if (
          tanggal === selectedDate.format("YYYY-MM-DD") &&
          (!selectedDoctor || dokter === selectedDoctor.nama_dokter)
        ) {
          result.push({
            id: "-",
            namaPasien: entry?.nama,
            noBPJS: entry?.ID_BPJS,
            jenisKelamin: entry?.jenis_kelamin,
            tanggalLahir: entry?.tanggal_lahir,
            nomorHP: entry?.nomor_HP,
            email: entry?.email_pasien,
            tanggalKonsultasi: tanggal,
            dokter,
            status: "DONE",
          });
        }
      });
    });

    return result;
  }, [doctorsData, historyData, selectedDoctor, selectedDate, scheduleData]);

  return (
    <div className="bg-light-primary px-[55px] py-[30px] h-[88dvh] font-inria-sans ">
      <div className="mb-[20px] flex justify-between">
        <div className="w-[500px]">
          <p className=" font-semibold mb-[5px] font-inter-sans text-[20px]">
            Pilih Dokter
          </p>
          <Autocomplete
            fullWidth
            options={doctorsData}
            getOptionLabel={(option) => option.nama_dokter}
            value={selectedDoctor ?? null}
            onChange={(event, value) => setSelectedDoctor(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Cari dokter disini ..."
                variant="outlined"
              />
            )}
            sx={{ backgroundColor: "white" }}
          />
        </div>

        <div>
          <p className=" font-semibold mb-[5px] font-inter-sans text-[20px]">
            Pilih Tanggal
          </p>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <DatePicker
              value={selectedDate}
              onChange={(newValue) => handleChangeDate(newValue)}
              sx={{ backgroundColor: "white" }}
            />
          </LocalizationProvider>
        </div>
      </div>
      <CustomTable rows={rows} columns={columns} />
    </div>
  );
};

export default PortalAdminComponent;
