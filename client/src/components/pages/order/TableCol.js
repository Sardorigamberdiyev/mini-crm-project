import React, { useState } from "react";
import getDate from "./../../../utils/getDate";
import textLength from "../../../utils/textLength";
import { Button, Popover } from "antd";
import { popover, PopoverInfo } from "../../popover";
import { AiOutlineMore, AiOutlineClose } from "react-icons/ai";
import DoingModal from "../../modal/DoingModal";
import InfoModal from "../../modal/InfoModal";

export default function TableCol(props) {
  const { item, getOrders } = props;
  const [infoPopover, setInfoPopover] = useState(false);
  const [doingModal, setModalDoing] = useState(false);
  const [infoModal, setInfoModal] = useState(false);

  return (
    <tr>
      <td>{getDate(item.date)}</td>
      <td className="states">
        {item.territoryTransportation.length > 0 ? (
          <Popover
            content={popover(item.territoryTransportation, item._id)}
            placement="bottom"
          >
            <Button>
              {item.territoryTransportation[0].firstCode +
                " - " +
                item.territoryTransportation[0].lastCode}
            </Button>
          </Popover>
        ) : (
          "-"
        )}
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
      <td>{item.generalRate}</td>
      <td>{item.additionalFee}</td>
      <td>{item.pricePerTon}</td>
      <td>
        {item.tlg.uzsPrice} {item.tlg.usdPrice}USD
      </td>
      <td>{item.totalPrice}</td>
      <td className="doing">
        <div className="block" onClick={() => setModalDoing(true)}>
          .
        </div>
        {item.doing.cost}
        {doingModal ? (
          <DoingModal
            id={item._id}
            getOrders={getOrders}
            setModalDoing={setModalDoing}
            firm={item.customerId.name}
          />
        ) : null}
      </td>
      <td>{item.debt}</td>
      <td
        className="info"
        style={{
          backgroundColor: item.additionalInfo.infoColor,
        }}
      >
        <div
          onClick={() => setInfoModal(true)}
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
              wagon={item.carriageRemainder}
              getOrders={getOrders}
            />
          ) : null}
          {infoModal ? (
            <InfoModal
              id={item._id}
              text={item.additionalInfo.infoText}
              setModalInfo={setInfoModal}
              getOrders={getOrders}
            />
          ) : null}
        </div>
      </td>
    </tr>
  );
}
