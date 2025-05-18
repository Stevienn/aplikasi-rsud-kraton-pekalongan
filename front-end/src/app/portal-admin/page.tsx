"use client";

import AdminHeader from "@/components/AdminHeader";
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
    </div>
  );
};

export default PortalAdmin;
