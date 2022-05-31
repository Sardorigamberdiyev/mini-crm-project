import React from "react";
import { Button } from "./../../assistant";
import InputGroup from "./InputGroup";

export default function Form() {
  const handleSubmit = (e, id) => {
    e.preventDefault();
    console.log(id);
  };
  return (
    <form onSubmit={e => handleSubmit(e, "id")}>
      <InputGroup />
      <InputGroup />
      <InputGroup />
      <div className="button">
        <Button type="submit">Скачат</Button>
      </div>
    </form>
  );
}
