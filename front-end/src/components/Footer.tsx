import React from "react";

interface IFooterProps {
  isFull?: boolean;
}

const Footer = ({ isFull }: IFooterProps) => {
  return (
    <footer
      className={`bg-blue-primary bottom-0 fixed flex items-center justify-center h-[85px] ${
        isFull ? "w-full" : "w-[50%]"
      } `}
    >
      <p className="text-light-primary">
        © 2025 RSUD Kraton Pekalongan | All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
