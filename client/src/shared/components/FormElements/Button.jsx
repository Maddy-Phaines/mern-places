import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = ({
  type = "button",
  onClick,
  href,
  inverse,
  to,
  exact,
  size,
  danger,
  disabled,
  isLoading,
  loadingLabel,
  children,
  ...rest
}) => {
  // Combine external disabled with loading state
  const isDisabled = disabled || isLoading;

  const classNames = [
    "button",
    inverse && "button--inverse",
    danger && "button--danger",
    isDisabled && "button--disabled",
  ]
    .filter(Boolean)
    .join(" ");
  // Pick the label to show
  const label = isLoading && loadingLabel ? loadingLabel : children;

  if (href) {
    return (
      <a
        className={`button button--${size || "default"} ${
          inverse && "button--inverse"
        } ${danger && "button--danger"}`}
        href={href}
      >
        {children}
      </a>
    );
  }
  if (to) {
    return (
      <Link
        to={to}
        exact={exact}
        className={`button button--${size || "default"} ${
          inverse && "button--inverse"
        } ${danger && "button--danger"}`}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={classNames}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      <>
        <span className="button__label">{label}</span>
        {isLoading && <span className="button__spinner" aria-hidden="true" />}
      </>
    </button>
  );
};

export default Button;
