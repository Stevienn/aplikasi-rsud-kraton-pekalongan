import React from "react";

interface IButtonProps {
  placeholder: string;
  isCancel?: boolean;
  onClick: () => void;
  customClass?: string;
}

const Button = ({
  placeholder,
  isCancel,
  onClick,
  customClass = "px-[20px] py-[10px]",
}: IButtonProps) => {
  return (
    <button
      className={`${
        isCancel ? "bg-red-600" : " bg-blue-primary hover:bg-orange-primary"
      } rounded-[7px] text-white  cursor-pointer  transition-colors duration-300 ease-in-out ${customClass}`}
      onClick={onClick}
    >
      {placeholder}
    </button>
  );
};

export default Button;
