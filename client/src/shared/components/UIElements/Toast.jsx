import { useEffect } from "react";
import "./Toast.css";

const Toast = ({
  open,
  message = "",
  duration = 1500,
  onClose = () => {},
  variant = "default",
}) => {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  const variantClass =
    variant === "success"
      ? "toast--success"
      : variant === "error"
      ? "toast--error"
      : "";

  return (
    <div
      className={`toast ${open ? "toast--open" : ""} ${variantClass}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast__content">{message}</div>
    </div>
  );
};

export default Toast;
