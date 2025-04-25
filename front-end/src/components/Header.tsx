import Image from "next/image";
import React from "react";
import Button from "./form/Button";
import { logout } from "./auth/lib";

const Header = ({ name }: { name: string | undefined }) => {
  const handleLogout = async () => {
    await logout();
  };
  return (
    <header className="flex items-center justify-between font-inria-sans px-[45px] py-[20px] bg-blue-secondary">
      <Image
        src="/images/logo/RSUDKraton.png"
        alt="Logo"
        width={142}
        height={19}
      />
      <h1 className="text-white text-[30px] font-inria-sans font-semibold">
        Selamat datang, {name} !
      </h1>
      <Button placeholder="Keluar" onClick={handleLogout} />
    </header>
  );
};

export default Header;
