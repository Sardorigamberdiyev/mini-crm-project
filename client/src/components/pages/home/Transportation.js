import React, { useEffect, useState } from "react";

export default function Transportation(props) {
  const { items, territories, totalCost, handleState, have, state } = props;

  const [code, setCode] = useState(true);
  const [firstCode, setFirstCode] = useState("");
  const [lastCode, setLastCode] = useState("");

  const handleInputChange = e => {
    const { name, value } = e.target;
    let data = territories.filter(
      item => item.customHouseFeeId.countryId._id !== state._id,
    );

    if (name === "firstCode") {
      setFirstCode(value);
      handleState("territoryTransportation", [
        ...data,
        {
          customHouseFeeId: items,
          stateCost: items.price,
          firstCode: value,
          lastCode,
        },
      ]);
    } else {
      setLastCode(value);
      handleState("territoryTransportation", [
        ...data,
        {
          customHouseFeeId: items,
          stateCost: items.price,
          firstCode,
          lastCode: value,
        },
      ]);
    }
  };
  const handleCode = () => {
    if (have) {
      let cost = 0;
      if (!code) {
        let data = territories.filter(
          item => item.customHouseFeeId.countryId._id !== state._id,
        );
        handleState("territoryTransportation", data);
        setFirstCode("");
        setLastCode("");

        if (totalCost > 0) {
          cost = totalCost - items.price;
        }
      } else if (have && code) {
        handleState("territoryTransportation", [
          ...territories,
          {
            customHouseFeeId: items,
            firstCode: 0,
            lastCode: 0,
            stateCost: 0,
          },
        ]);
        cost = totalCost + items.price;
      }
      cost = Math.round(cost * 10000) / 10000;
      handleState("generalRate", cost);
      setCode(!code);
    }
  };

  useEffect(() => {
    const defaultItem = territories.filter(
      item => item.customHouseFeeId.countryId._id === state._id,
    )[0];
    const defaultCode = typeof defaultItem !== "object";
    const defaultFirstCode = defaultCode ? "" : defaultItem.firstCode;
    const defaultLastCode = defaultCode ? "" : defaultItem.lastCode;

    setCode(defaultCode);
    setFirstCode(defaultFirstCode);
    setLastCode(defaultLastCode);
  }, []);
  return (
    <div className="transportation">
      <div className={`country ${code ? "" : "active"}`} onClick={handleCode}>
        {state.name}
      </div>
      <div className={`money ${code ? "notactive" : ""}`}>
        {have ? items.price : ""} USD
      </div>
      <input
        type="number"
        disabled={code}
        className="id"
        required
        name="firstCode"
        value={firstCode}
        onChange={handleInputChange}
        placeholder="123456789"
      />
      <input
        type="number"
        disabled={code}
        className="count"
        required
        name="lastCode"
        value={lastCode}
        onChange={handleInputChange}
        placeholder="789"
      />
    </div>
  );
}
