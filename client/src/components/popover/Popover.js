import React from "react";
import { useNavigate } from "react-router-dom";
import "./popover.css";

export const popover = (items, id) => {
  const navigate = useNavigate();
  const onLink = () => {
    navigate(`/order/${id}`);
  };
  return (
    <div className="popover">
      {items.map(item => {
        const {
          lastCode,
          firstCode,
          customHouseFeeId: {
            countryId: { name },
          },
        } = item;
        return (
          <div key={item._id} className="state" onClick={onLink}>
            <span>{name}: </span>
            {firstCode} - {lastCode}
          </div>
        );
      })}
    </div>
  );
};
