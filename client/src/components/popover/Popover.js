import React from "react";
import "./popover.css";

export const popover = items => {
  return (
    <div className="popover">
      {items.map(item => (
        <div key={item._id} className="state">
          <span>{item.stateId.name}: </span>
          {item.firstCode} - {item.lastCode}
        </div>
      ))}
    </div>
  );
};
