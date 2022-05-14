import React from "react";
import ReactTooltip from "react-tooltip";

const Input = ({ label, value, tip, setValue, type = "text" }) => (
  <div className="input-group mb-3">
    <span className="input-group-text">{label}</span>
    <input
      type={type}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      data-tip={tip}
      className="form-control"
    />
    <ReactTooltip globalEventOff="click" />

  </div>
);

export default Input;
