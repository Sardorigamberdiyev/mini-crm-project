import React from "react";
import { Button } from "./../../assistant";
import InputGroup from "./InputGroup";

export default function Form(props) {
  const { onSubmit, items, handleState, defaultItems } = props;
  return (
    <form onSubmit={onSubmit}>
      {defaultItems.map((item, idx) => (
        <InputGroup
          handleState={handleState}
          key={idx}
          n={idx}
          items={items}
          item={defaultItems[idx]}
          carriage={item.carriage}
        />
      ))}
      <div className="button">
        <Button type="submit">Скачат</Button>
      </div>
    </form>
  );
}
