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
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const CustomTable = ({
  columns,
  rows,
  handleAction,
}: {
  columns: any;
  rows: any;
  handleAction?: any;
}) => {
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
  return (
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
                    paddingLeft: 38,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ padding: 5, fontStyle: "italic", color: "#888" }}
                >
                  Tidak ada data pasien.
                </TableCell>
              </TableRow>
            ) : (
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          sx={{ paddingY: 5, paddingLeft: 5 }}
                          key={column.id}
                        >
                          {column.id === "aksiDiag" && (
                            <Image
                              src="/icons/action_icon.png"
                              alt="icon_action"
                              width={21}
                              height={21}
                              onClick={() =>
                                handleAction(row.noBPJS, row.keluhan)
                              }
                              className="cursor-pointer"
                            />
                          )}
                          {column.id === "aksiRekap" && (
                            <Link href={`/rekap-medis/${row.id}`}>
                              <Image
                                src="/icons/action_icon.png"
                                alt="icon_action"
                                width={21}
                                height={21}
                                className="cursor-pointer"
                              />
                            </Link>
                          )}
                          {column.id === "status" ? (
                            value === "DONE" ? (
                              <p className="font-bold text-blue-primary">
                                {value}
                              </p>
                            ) : (
                              <p className="font-bold text-red-600">{value}</p>
                            )
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CustomTable;
