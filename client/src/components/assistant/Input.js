import React from "react";
import "./assistant.css";

export default function Input(props) {
  const { error } = props;
  return (
    <div className="assistant_input">
      <input {...props} />
      <p>{error}</p>
    </div>
  );
}
