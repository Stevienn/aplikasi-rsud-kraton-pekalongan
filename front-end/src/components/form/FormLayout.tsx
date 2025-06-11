import React from "react";

interface IFormLayoutProps {
  title: string;
  children: React.ReactNode;
}

const FormLayout = ({ title, children }: IFormLayoutProps) => {
  return (
    <div className="bg-gradient-to-b from-blue-secondary to-blue-tertiary h-[100%] font-inria-sans">
      <div className="flex flex-col items-center pt-[50px] py-[45px]">
        <h1 className="text-white md:text-[64px] text-[50px] font-bold">
          {title}
        </h1>
        <h2 className="text-white text-[36px] font-bold">
          RSUD Kraton Pekalongan
        </h2>
      </div>
      <div className="font-inter-sans bg-white md:rounded-[40px] max-w-[900px] mx-auto shadow-2xl flex flex-col justify-center items-center md:px-[550px] px-[50px] py-[40px]">
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
