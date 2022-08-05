import React, { useEffect } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { ChangeAdminMenu } from "../../../../actions";
import { Element, Button, Input } from "../../../assistant";
import { Spiner } from "../../../assistant";

function Border(props) {
  const {
    onSubmit,
    onChange,
    onSelectChange,
    onDelete,
    price,
    countryId,
    carriageId,
    countries,
    carriages,
    loading,
    uploadLoading,
    data,
  } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ChangeAdminMenu("border"));
  }, [dispatch]);
  return (
    <div className="admin border">
      <div className="border_push">
        <h1>Граница</h1>
        <form onSubmit={onSubmit}>
          <Select
            required
            placeholder="Госуарства"
            className="select"
            name="countryId"
            value={countryId}
            onChange={onSelectChange}
            options={countries}
          />
          <Select
            required
            placeholder="Baгон"
            className="select"
            name="carriageId"
            value={carriageId}
            onChange={onSelectChange}
            options={carriages}
          />
          <Input
            required
            placeholder="Цена"
            type="text"
            name="price"
            onChange={onChange}
            value={price}
            error={""}
          />

          <div className="button">
            <Button type="submit">Добавлять</Button>
          </div>
        </form>
      </div>
      <div className="border-element">
        {loading ? (
          <Spiner />
        ) : (
          <>
            <div className="border_all">
              {data.map(item => (
                <Element
                  key={item._id}
                  onDelete={onDelete}
                  id={item._id}
                  textArray={[
                    item.countryId.name,
                    item.carriageId.typeCarriage,
                    `${item.price} USD`,
                  ]}
                />
              ))}
            </div>
            {uploadLoading ? <Spiner /> : null}
          </>
        )}
      </div>
      {/* <Pagination
        skip={skip}
        limit={limit}
        total={statesMaxLength}
        onSkip={onSkip}
      /> */}
    </div>
  );
}

export default Border;
