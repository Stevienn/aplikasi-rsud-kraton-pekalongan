import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import CustomTable from "./CustomTable";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useGetDoctors, useGetSpecialistDoctors } from "@/hooks/api/useDoctor";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useGetRekapMedis } from "@/hooks/api/useRekapMedis";

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
  const { data: doctorsDataUmum } = useGetDoctors();
  const { data: doctorsDataSpesialis } = useGetSpecialistDoctors();
  const { data: historyData } = useGetRekapMedis();

  const [selectedDoctor, setSelectedDoctor] = useState();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const today = selectedDate.format("dddd");

  const handleChangeDate = (newValue) => {
    setSelectedDate(newValue);
  };

  const doctorsData = [
    ...(doctorsDataUmum || []),
    ...(doctorsDataSpesialis || []),
  ];

  const rows = useMemo(() => {
    if (!doctorsData || !historyData || !selectedDate) return [];

    const result = [];

    // Ambil data dari jadwal dokter
    doctorsData.forEach((doctor) => {
      if (selectedDoctor && doctor.nama_dokter !== selectedDoctor.nama_dokter)
        return;

      doctor.schedule_dokter?.forEach((schedule) => {
        if (schedule.hari !== today) return;

        schedule.hari_praktek_set?.forEach((praktek) => {
          praktek.data_pendaftaran?.forEach((dp) => {
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
                dokter: doctor.nama_dokter,
                status: "PENDING",
              });
            }
          });
        });
      });
    });

    // Ambil data dari histori pasien
    historyData.forEach((entry) => {
      const pasien = entry.data_pasien;

      entry.history?.forEach((hist) => {
        const tanggal = hist.tanggal_konsultasi;
        const dokter =
          hist.data_dokter_umum?.nama_dokter ||
          hist.data_dokter_spesialis?.nama_dokter;

        if (
          tanggal === selectedDate.format("YYYY-MM-DD") &&
          (!selectedDoctor || dokter === selectedDoctor.nama_dokter)
        ) {
          result.push({
            id: "-",
            namaPasien: pasien?.nama,
            noBPJS: pasien?.ID_BPJS,
            jenisKelamin: pasien?.jenis_kelamin,
            tanggalLahir: pasien?.tanggal_lahir,
            nomorHP: pasien?.nomor_HP,
            email: pasien?.email_pasien,
            tanggalKonsultasi: tanggal,
            dokter,
            status: "DONE",
          });
        }
      });
    });

    return result;
  }, [doctorsData, historyData, selectedDoctor, selectedDate]);

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
