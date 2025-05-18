import Image from "next/image";
import React from "react";
import { logoutAdmin } from "./auth/lib";
import LogoutIcon from "@mui/icons-material/Logout";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";

const AdminHeader = ({
  name,
  image,
  slug,
  linkName1,
}: {
  name: string | undefined;
  image: string;
  slug?: string;
  linkName1?: string;
}) => {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAdmin();
  };

  return (
    <header className="flex items-center justify-between font-inria-sans px-[45px] py-[20px] bg-blue-secondary">
      <Image
        src="/images/logo/RSUDKraton.png"
        alt="Logo"
        width={142}
        height={19}
      />
      <div className="flex items-center ml-[140px] gap-[90px]">
        <Link
          href="/portal-dokter"
          className={`text-white text-[20px] font-light font-inria-sans cursor-pointer ${
            pathname === "/portal-dokter" || "/portal-admin"
              ? "underline font-medium"
              : ""
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/rekap-medis"
          className={`text-white text-[20px] font-light font-inria-sans cursor-pointer ${
            pathname === "/rekap-medis" || pathname === `/rekap-medis/${slug}`
              ? "underline font-medium"
              : ""
          }`}
        >
          {linkName1}
        </Link>
        <Link
          href="/rekap-medis"
          className={`text-white text-[20px] font-light font-inria-sans cursor-pointer ${
            pathname === "/data-penyakit" ? "underline font-medium" : ""
          } `}
        >
          Data Penyakit
        </Link>
      </div>
      <div className="flex items-center gap-[20px]">
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <img
            src={image}
            alt="Profile Picture"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <p className="text-white text-[17px] font-inria-sans cursor-default">
          {name}
        </p>
        <LogoutIcon
          className="cursor-pointer"
          sx={{ color: "white" }}
          onClick={handleLogout}
        />
      </div>
    </header>
  );
};

export default AdminHeader;
