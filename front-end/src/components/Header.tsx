import Image from "next/image";
import React from "react";
import Button from "./form/Button";
import { logout } from "./auth/lib";

const Header = ({ name }: { name: string | undefined }) => {
  const handleLogout = async () => {
    await logout();
  };
  return (
    <>
      <header className="md:flex grid grid-cols-2 gap-x-[200px] gap-y-[10px] items-center justify-between font-inria-sans md:px-[200px] py-[20px] bg-white ">
        <Image
          src="/images/logo/RSUDKraton.png"
          alt="Logo"
          width={142}
          height={19}
        />
        <h1 className="text-gray-800 text-[30px] grid- font-inria-sans font-semibold col-span-2 row-start-2 justify-self-center">
          Selamat datang, {name} !
        </h1>
        <div className="col-start-2 row-start-1">
          <Button placeholder="Keluar" onClick={handleLogout} />
        </div>
      </header>
      <header className="bg-gradient-to-r from-orange-primary to-orange-400 font-inria-sans pl-[60px] md:pl-[200px] py-[40px] ">
        <h1 className="text-white text-[20px] font-inter-sans font-semibold">
          Pendaftaran Online
        </h1>
      </header>
    </>
  );
};

export default Header;
