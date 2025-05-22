"use client";

import AdminHeader from "@/components/AdminHeader";
import Footer from "@/components/Footer";
import PortalAdminComponent from "@/components/PortalAdminComponent";
import React from "react";

const PortalAdmin = () => {
  return (
    <div>
      <AdminHeader
        name="Admin"
        image="/images/no_profile.png"
        linkName1="Data Kunjungan"
      />
      <PortalAdminComponent />
      <Footer isFull />
    </div>
  );
};

export default PortalAdmin;
