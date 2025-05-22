import { useGetPatientDoctorAttendance } from "@/hooks/api/useAttendance";
import { FormControl, MenuItem, Paper, Select } from "@mui/material";
import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

dayjs.locale("id");

const monthData = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const yearData = [2025];

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "No",
    width: 70,
  },
  {
    field: "namaDokter",
    headerName: "Nama Dokter",
    width: 700,
  },
  {
    field: "spesialis",
    headerName: "Spesialis",
    width: 400,
  },
  {
    field: "jumlahPasien",
    headerName: "Jumlah Pasien",
    width: 130,
  },
];

const PatientDoctorAttendance = () => {
  const { data, isLoading } = useGetPatientDoctorAttendance();
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MMMM"));
  const [selectedYear, setSelectedYear] = useState(dayjs().format("YYYY"));

  if (isLoading) return <div></div>;

  const getSelectedDoctor = () => {
    if (!isLoading) {
      return data?.find(
        (d) => d.tahun === Number(selectedYear) && d.bulan === selectedMonth
      );
    }
  };

  const selectedDoctor = getSelectedDoctor();

  const combinedSelectedDoctor = [
    ...(selectedDoctor?.dokter_umum || []),
    ...(selectedDoctor?.dokter_spesialis || []),
  ];

  const rows = combinedSelectedDoctor.map((data, index) => {
    return {
      id: index + 1,
      namaDokter: data.nama_dokter,
      spesialis: data.spesialisasi,
      jumlahPasien: data.jumlah_pasien,
    };
  });

  const paginationModel = { page: 0, pageSize: 5 };

  const DropdownComponent = ({ selected, setSelected, value }: any) => {
    return (
      <FormControl sx={{ width: 200 }}>
        <Select
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
        >
          {value.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const TableComponent = () => {
    return (
      <Paper sx={{ height: 400, mx: 5, marginBottom: 3 }} elevation={0}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
          localeText={{
            noRowsLabel: "Tidak ada data pasien",
          }}
        />
      </Paper>
    );
  };

  return (
    <div className="bg-light-primary">
      <div className="px-[55px] pt-[30px] pb-[100px] font-inria-sans">
        <div className="font-inria-sans bg-white mx-[40px] my-[20px] px-[30px] py-[40px] rounded-[40px]">
          <h1 className="font-inter-sans font-bold text-[23px] ml-[40px] mb-[15px]">
            Tabel Kunjungan Pasien BPJS Per Dokter
          </h1>
          <div className="flex items-center mb-[20px]">
            <h2 className="font-inter-sans font-medium text-[23px] ml-[40px] mr-[10px]">
              Bulan
            </h2>
            <DropdownComponent
              selected={selectedMonth}
              setSelected={setSelectedMonth}
              value={monthData}
            />
            <h2 className="font-inter-sans font-medium text-[23px] ml-[40px] mr-[10px]">
              Tahun
            </h2>
            <DropdownComponent
              selected={selectedYear}
              setSelected={setSelectedYear}
              value={yearData}
            />
          </div>
          <TableComponent />
        </div>
      </div>
    </div>
  );
};

export default PatientDoctorAttendance;
