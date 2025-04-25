import React from "react";

interface IInputProps {
  name: string;
  type: string;
  placeholder?: string;
  customClass?: string;
  inputWidth?: string;
  value: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isWarning?: string;
  isDisabled?: boolean;
}

const InputField = ({
  name,
  type,
  placeholder,
  customClass,
  inputWidth,
  value,
  onChange,
  isWarning,
  isDisabled,
}: IInputProps) => {
  return (
    <div className={`${isWarning ? "" : customClass}`}>
      <p className="font-semibold text-gray-700 mb-[8px]">{name}</p>
      <input
        className={`border-2 border-gray-300 px-[12px] py-[8px] ${inputWidth} rounded-[4px]`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
      />
      {isWarning && (
        <p className="text-red-500 text-[13px] mb-[15px]">{isWarning}</p>
      )}
    </div>
  );
};

export default InputField;
