import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChangeAdminMenu } from "../../../../actions";
import { Input, Button, Element, Pagination } from "../../../assistant";
import { Spiner } from "../../../assistant";

export default function States(props) {
  const {
    name,
    cost,
    nameValue,
    costValue,
    allStates,
    loading,
    uploadLoading,
    statesMaxLength,
    skip,
    limit,
    onSkip,
    onChange,
    onDelete,
    onSubmit,
  } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ChangeAdminMenu("state"));
  }, [dispatch]);
  return (
    <div className="state">
      <div className="state_push">
        <h1>Госуарства</h1>
        <form onSubmit={onSubmit}>
          <Input
            placeholder="Государство"
            type="text"
            name="nameValue"
            onChange={onChange}
            value={nameValue}
            error={name}
          />
          <Input
            placeholder="10.2 USD"
            type="text"
            name="costValue"
            onChange={onChange}
            value={costValue}
            error={cost}
          />
          <div className="button">
            <Button type="submit">Добавлять</Button>
          </div>
        </form>
      </div>
      <div className="state-element">
        {loading ? (
          <Spiner />
        ) : (
          <>
            <div className="state_all">
              {allStates.map(item => (
                <Element
                  key={item._id}
                  onDelete={onDelete}
                  id={item._id}
                  textArray={[item.name, `${item.cost} USD`]}
                />
              ))}
            </div>
            {uploadLoading ? <Spiner /> : null}
          </>
        )}
      </div>
      <Pagination
        skip={skip}
        limit={limit}
        total={statesMaxLength}
        onSkip={onSkip}
      />
    </div>
  );
}
