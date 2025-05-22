"use client";

import { getUser } from "@/api/user";
import AdminHeader from "@/components/AdminHeader";
import Footer from "@/components/Footer";
import { useGetICDReport } from "@/hooks/api/useICDReport";
import { IUserDoctor } from "@/interface/doctorInterface";
import { FormControl, MenuItem, Paper, Select } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
    headerName: "Kode",
    width: 70,
  },
  {
    field: "nama",
    headerName: "Nama",
    width: 1000,
  },
  {
    field: "jumlah",
    headerName: "Jumlah",
    width: 400,
  },
];

const DataPenyakit = () => {
  const paginationModel = { page: 0, pageSize: 10 };
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MMMM"));
  const [selectedYear, setSelectedYear] = useState(dayjs().format("YYYY"));

  const { data, isLoading } = useGetICDReport();

  if (isLoading)
    return (
      <div>
        <AdminHeader
          name="Admin"
          image="/images/no_profile.png"
          linkName1="Data Pengunjung"
        />
        Loading data...
      </div>
    );

  const getSelectedICD = () => {
    return data.find(
      (d) => d.tahun === Number(selectedYear) && d.bulan === selectedMonth
    );
  };

  const selectedICD = getSelectedICD();

  const rows = selectedICD?.icd_list.map((data) => {
    return {
      id: data.kode,
      nama: data.nama_diagnosa,
      jumlah: data.jumlah_pasien,
    };
  });

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
      <Paper sx={{ mx: 5, marginBottom: 3 }} elevation={0}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
          localeText={{
            noRowsLabel: "Tidak ada data diagnosa",
          }}
        />
      </Paper>
    );
  };

  if (isLoading)
    return (
      <div>
        <AdminHeader
          name="Admin"
          image="/images/no_profile.png"
          linkName1="Data Pengunjung"
        />
        Loading data...
      </div>
    );

  return (
    <>
      <AdminHeader
        name="Admin"
        image="/images/no_profile.png"
        linkName1="Data Pengunjung"
      />
      <div className="bg-light-primary h-[95dvh]">
        <div className="px-[55px] py-[15px] font-inria-sans">
          <div className="font-inria-sans bg-white mx-[40px] my-[20px] px-[30px] py-[40px] rounded-[40px]">
            <div className="flex items-center mb-[20px]">
              <h1 className="font-inter-sans font-bold text-[23px] ml-[40px] mr-[10px]">
                Data Diagnosis Terbanyak Bulan
              </h1>
              <DropdownComponent
                selected={selectedMonth}
                setSelected={setSelectedMonth}
                value={monthData}
              />
              <h1 className="font-inter-sans font-bold text-[23px] ml-[15px] mr-[10px]">
                Tahun
              </h1>
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
      <Footer isFull />
    </>
  );
};

export default DataPenyakit;
