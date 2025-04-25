import CancelIcon from "@mui/icons-material/Cancel";
import React, { JSX, useEffect } from "react";
import ReactDOM from "react-dom";

interface IModalWrapperProps {
  children: JSX.Element | JSX.Element[] | string;
  isOpen: boolean;
}

const ModalWrapper = ({ children, isOpen }: IModalWrapperProps) => {
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // adjust the opacity to your liking
      }}
      className={`${
        isOpen ? "opacity-100" : "opacity-0"
      } fixed left-0 top-0 z-[1001] flex h-screen w-screen flex-1 flex-col items-center transition-opacity duration-500 font-inter-sans`}
    >
      <div className="h-[120px] min-h-[40px]"></div>
      {children}
      <div className="min-h-[40px]"></div>
    </div>
  );
};

interface IModalProps {
  children: JSX.Element | JSX.Element[] | string | React.ReactNode;
  width: string;
  onClose?: () => void;
}

const Modal = ({ children, width, onClose }: IModalProps) => {
  const sharedModal = document.querySelectorAll(`[id^="shared-modal"]`)[0];
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  // const handleClose = () => {
  //   setIsOpen(false);
  //   setTimeout(onClose, 500);
  // };

  return ReactDOM.createPortal(
    <ModalWrapper isOpen={isOpen}>
      <div className={`${width} bg-white`}>{children}</div>
    </ModalWrapper>,
    sharedModal
  );
};

interface IHeaderProps {
  title: JSX.Element | JSX.Element[] | string | React.ReactNode;
  isCancel?: boolean;
  onClose?: () => void;
}

const Header = ({ title, isCancel }: IHeaderProps) => {
  return (
    <div className="flex items-center bg-blue-primary justify-center">
      <div className="py-[12px] px-[20px]">
        <p className="text-light-primary font-semibold">{title}</p>
      </div>
      {isCancel && <CancelIcon className="" />}
    </div>
  );
};

interface IBodyProps {
  children: JSX.Element | JSX.Element[] | string | React.ReactNode;
}

const Body = ({ children }: IBodyProps) => {
  return <div className="px-[45px] py-[30px]">{children}</div>;
};

interface IFooterProps {
  children: JSX.Element | JSX.Element[] | string | React.ReactNode;
}

const Footer = ({ children }: IFooterProps) => {
  return (
    <div className="flex justify-end gap-[25px] px-[45px] pb-[30px]">
      {children}
    </div>
  );
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
