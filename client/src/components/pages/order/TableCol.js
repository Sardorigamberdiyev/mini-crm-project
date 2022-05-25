import React, { useState } from "react";
import getDate from "./../../../utils/getDate";
import textLength from "../../../utils/textLength";
import { Button, Popover } from "antd";
import { popover, PopoverInfo } from "../../popover";
import { AiOutlineMore, AiOutlineClose } from "react-icons/ai";

export default function TableCol(props) {
  const { item } = props;
  const [infoPopover, setInfoPopover] = useState(false);
  return (
    <tr>
      <td>{getDate(item.date)}</td>
      <td className="states">
        <Popover
          content={popover(item.territoryTransportation)}
          placement="bottom"
        >
          <Button>
            {item.territoryTransportation[0].firstCode +
              " - " +
              item.territoryTransportation[0].lastCode}
          </Button>
        </Popover>
      </td>
      <td>{item.senderStation}</td>
      <td>{item.arrivalStation}</td>
      <td>{item.customerId.name}</td>
      <td>{item.sender}</td>
      <td>{item.recipient}</td>
      <td>{item.cargoType}</td>
      <td>{item.carriageCount}</td>
      <td>{item.carriageReturn}</td>
      <td>{item.carriageRemainder}</td>
      <td>{item.capacity}</td>
      <td>{item.territorialTotalCost}</td>
      <td>{item.pricePerTon}</td>
      <td>{item.pricePerTon}</td>
      <td>
        {item.tlg.uzsPrice} {item.tlg.usdPrice}USD
      </td>
      <td>{item.actualTotalPrice}</td>
      <td>{item.doing.cost}</td>
      <td>{item.debt}</td>
      <td
        className="info"
        style={{
          backgroundColor: item.additionalInfo.infoColor,
        }}
      >
        <div
          className={`text ${
            item.additionalInfo.infoColor !== "transparent" ? "active" : ""
          }`}
        >
          {textLength(item.additionalInfo.infoText, 23)}
        </div>
        <div
          className={`icons ${item.additionalInfo.infoText ? "active" : ""}`}
          onClick={() => setInfoPopover(!infoPopover)}
        >
          {infoPopover ? <AiOutlineClose /> : <AiOutlineMore />}
        </div>
        <div className="nameInfo">
          {infoPopover ? (
            <PopoverInfo
              id={item._id}
              text={item.additionalInfo.infoText}
              wagon={item.carriageRemainder}
            />
          ) : null}
        </div>
      </td>
    </tr>
  );
}
