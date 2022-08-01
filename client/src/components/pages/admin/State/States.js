import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChangeAdminMenu } from "../../../../actions";
import { Input, Button, Element, Pagination } from "../../../assistant";
import { Spiner } from "../../../assistant";

export default function States(props) {
  const {
    name,
    nameValue,
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
    <div className="admin state">
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
                  textArray={[item.name]}
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
