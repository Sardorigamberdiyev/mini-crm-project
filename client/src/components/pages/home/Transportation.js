import React, { useEffect, useState } from "react";

export default function Transportation(props) {
  const {
    items,
    territories,
    totalCost,
    handleState,
    defaultTerritoryTransportation,
  } = props;

  const [code, setCode] = useState(true);
  const [firstCode, setFirstCode] = useState("");
  const [lastCode, setLastCode] = useState("");

  const handleInputChange = e => {
    const { name, value } = e.target;
    let data = territories.filter(item => item.stateId !== items._id);

    if (name === "firstCode") {
      setFirstCode(value);
      handleState("territoryTransportation", [
        ...data,
        {
          stateId: items._id,
          stateCost: items.cost,
          firstCode: value,
          lastCode,
        },
      ]);
    } else {
      setLastCode(value);
      handleState("territoryTransportation", [
        ...data,
        {
          stateId: items._id,
          stateCost: items.cost,
          firstCode,
          lastCode: value,
        },
      ]);
    }
  };
  const handleCode = () => {
    let cost = 0;
    if (!code) {
      let data = territories.filter(item => item.stateId !== items._id);
      handleState("territoryTransportation", data);
      setFirstCode("");
      setLastCode("");

      if (totalCost > 0) {
        cost = totalCost - items.cost;
      }
    } else {
      handleState("territoryTransportation", [
        ...territories,
        {
          stateId: items._id,
          firstCode: 0,
          lastCode: 0,
          stateCost: 0,
        },
      ]);
      cost = totalCost + items.cost;
    }
    cost = Math.round(cost * 10000) / 10000;
    handleState("generalRate", cost);
    setCode(!code);
  };

  useEffect(() => {
    const defaultItem = defaultTerritoryTransportation.filter(
      item => item.stateId._id === items._id,
    )[0];
    const defaultCode = typeof defaultItem !== "object";
    const defaultFirstCode = defaultCode ? "" : defaultItem.firstCode;
    const defaultLastCode = defaultCode ? "" : defaultItem.lastCode;

    setCode(defaultCode);
    setFirstCode(defaultFirstCode);
    setLastCode(defaultLastCode);
  }, [defaultTerritoryTransportation]);
  return (
    <div className="transportation">
      <div className={`country ${code ? "" : "active"}`} onClick={handleCode}>
        {items.name}
      </div>
      <div className={`money ${code ? "notactive" : ""}`}>{items.cost} USD</div>
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
