import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Backdrop from "./Backdrop";
import "./Modal.css";

const ModalOverlay = (props) => {
  const content = (
    <motion.div
      className={`modal ${props.className || ""}`}
      style={props.style}
      initial={{ y: -20, opacity: 0 }} // slide down from above
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 36, bounce: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
    >
      <header className={`modal__header ${props.headerClass || ""}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass || ""}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass || ""}`}>
          {props.footer}
        </footer>
      </form>
    </motion.div>
  );
  return createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <AnimatePresence>
      {props.show && (
        <>
          <Backdrop onClick={props.onCancel} />
          <ModalOverlay {...props} />
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
