import "./toast.css";
import { useEffect } from "react";
import success from "../../assets/icons/success-icon.svg";
import error from "../../assets/icons/error-icon.svg";

export interface ToastProps {
  id: string;
  destroy: () => void;
  message: string;
  type: "success" | "error" | null;
  duration?: number;
}

const ToastMessage = (props: ToastProps) => {
  const { destroy, message, duration = 0, id, type } = props;

  useEffect(() => {
    if (!duration) return;

    const countTime = setTimeout(() => {
      destroy();
    }, duration);

    return () => clearTimeout(countTime);
  }, [destroy, duration]);

  return (
    <div>
      <div className="toast-main"></div>
      {type === "success" && (
        <img src={success} alt="success" className="toast-message__icon" />
      )}
      {type === "error" && (
        <img src={error} alt="error" className="toast-message__icon" />
      )}
      {message}
    </div>
  );
};

export default ToastMessage;
