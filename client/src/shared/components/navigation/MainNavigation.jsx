import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import "./MainNavigation.css";

import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";

const MainNavigation = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const triggerBtnRef = useRef(null);

  const openDrawer = () => {
    triggerBtnRef.current = document.activeElement;
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
    // Return focus to the trigger for good keyboard UX
    if (triggerBtnRef.current && triggerBtnRef.current.focus) {
      triggerBtnRef.current.focus();
    }
  };

  // Close on Escape
  useEffect(() => {
    if (!drawerIsOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerIsOpen]);

  // Lock background scroll when open
  useEffect(() => {
    if (drawerIsOpen) {
      const { overflow } = document.body.style;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = overflow;
      };
    }
  }, [drawerIsOpen]);

  return (
    <>
      {/* Keep AnimatePresence mounted at all times */}
      <AnimatePresence>
        {drawerIsOpen && <Backdrop key="backdrop" onClick={closeDrawer} />}
        {drawerIsOpen && (
          <SideDrawer key="drawer" onClose={closeDrawer}>
            <nav id="mobile-drawer" className="main-navigation__drawer-nav">
              <NavLinks />
            </nav>
          </SideDrawer>
        )}
      </AnimatePresence>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawer}
          aria-haspopup="dialog"
          aria-expanded={drawerIsOpen}
          aria-controls="mobile-drawer"
          aria-label="Open menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <h1 className="main-navigation__title">
          <Link to="/">Your Places</Link>
        </h1>

        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
