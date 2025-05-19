"use client";

import AdminHeader from "@/components/AdminHeader";
import PatientAttendance from "@/components/PatientAttendance";
import PatientDoctorAttendance from "@/components/PatientDoctorAttendance";
import React from "react";

const DataKunjungan = () => {
  return (
    <div>
      <AdminHeader
        name="Admin"
        image="/images/no_profile.png"
        linkName1="Data Pengunjung"
      />
      <PatientAttendance />
      <PatientDoctorAttendance />
    </div>
  );
};

export default DataKunjungan;
