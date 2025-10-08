import { createPortal } from "react-dom";
import { motion } from "motion/react";
import "./SideDrawer.css";

const SideDrawer = ({ children, onClose }) => {
  const container = document.getElementById("drawer-hook");
  if (!container) return null;

  return createPortal(
    <motion.aside
      className="side-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      tabIndex={-1}
      // animation
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "tween", duration: 0.24 }}
    >
      {/* optional close affordance inside the drawer (keyboard/mouse) */}
      <button
        className="side-drawer__close"
        onClick={onClose}
        aria-label="Close menu"
      >
        ×
      </button>
      {children}
    </motion.aside>,
    container
  );
};

export default SideDrawer;
