import React from "react";
import { Pagination } from "antd";

export default function PaginationComponent(props) {
  const { onSkip, limit, skip, total } = props;

  return (
    <div className="assistant_pagination">
      <Pagination
        current={skip}
        defaultCurrent={1}
        onChange={e => onSkip(e)}
        pageSize={limit}
        total={total}
      />
    </div>
  );
}
