import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dummyBuatTabel from "@/components/assets/dummyBuatTabel";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

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
    id: "aksi",
    label: "Aksi",
    width: 300,
  },
];

const CustomTable = () => {
  const data = dummyBuatTabel;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = data.map((item) => ({
    id: item.noUrut,
    namaPasien: item.nama,
    noBPJS: item.id,
    jenisKelamin: item.gender,
    tanggalLahir: item.birthDate,
    aksi: null,
  }));

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div className="bg-light-primary px-[55px] py-[40px] h-[88dvh] font-inria-sans ">
      <Paper
        sx={{ width: "100%", overflow: "hidden", border: 0, borderRadius: 5 }}
      >
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{
                      width: column.width,
                      fontSize: 17,
                      fontWeight: "bold",
                      color: "var(--color-blue-primary)",
                      paddingLeft: 38,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow key={i}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            sx={{ paddingY: 5, paddingLeft: 5 }}
                            key={column.id}
                          >
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default CustomTable;
