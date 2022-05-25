import React from "react";
import "./assistant.css";

export default function Button(props) {
  const { children, type, className } = props;
  return (
    <button {...props} type={type} className={`assistant_button ${className}`}>
      {children}
    </button>
  );
}
