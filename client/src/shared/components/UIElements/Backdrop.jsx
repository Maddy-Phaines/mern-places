import { createPortal } from "react-dom";
import { motion } from "motion/react";
import "./Backdrop.css";

const Backdrop = ({ onClick }) => {
  const container = document.getElementById("backdrop-hook");
  if (!container) return null;

  return createPortal(
    <motion.div
      className="backdrop"
      onClick={onClick}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    />,
    container
  );
};

export default Backdrop;
