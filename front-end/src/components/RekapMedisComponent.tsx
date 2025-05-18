import React, { useMemo, useState } from "react";
import CustomTable from "./CustomTable";
import { useGetRekapMedis } from "@/hooks/api/useRekapMedis";
import { TextField } from "@mui/material";

const columns = [
  {
    id: "id",
    label: "No BPJS",
    width: 200,
  },
  {
    id: "namaPasien",
    label: "Nama Pasien",
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
    id: "aksiRekap",
    label: "Aksi",
    width: 300,
  },
];

const RekapMedisComponent = ({ id, specialization, doctor }: any) => {
  const { data: dataRM, isLoading } = useGetRekapMedis();
  const [searchTerm, setSearchTerm] = useState("");

  const rows = useMemo(() => {
    if (!dataRM) return [];
    return dataRM.map((data) => ({
      id: data.data_pasien?.ID_BPJS,
      namaPasien: data.data_pasien?.nama,
      jenisKelamin: data.data_pasien?.jenis_kelamin,
      tanggalLahir: data.data_pasien?.tanggal_lahir,
    }));
  }, [dataRM]);

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter((row: any) =>
      row.namaPasien?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rows, searchTerm]);

  if (isLoading) return <div>Loading patient data...</div>;

  return (
    <div className="bg-light-primary px-[55px] py-[30px] h-[88dvh] font-inria-sans ">
      <p className="text-blue-primary text-[20px] font-semibold font-inter-sans mb-[5px]">
        Cari Pasien
      </p>
      <TextField
        placeholder="ex: John Doe"
        variant="outlined"
        size="medium"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3, backgroundColor: "white", width: 400 }}
      />
      <CustomTable columns={columns} rows={filteredRows} />
    </div>
  );
};

export default RekapMedisComponent;
