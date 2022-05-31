import React from "react";
import { Tabs } from "antd";
import Form from "./Form";

import "./overhead.css";

const { TabPane } = Tabs;

export default function Overhead() {
  const onChange = key => {
    console.log(key);
  };

  return (
    <div className="overhead">
      <div className="overhead-container">
        <div className="overhead-main">
          <h1>Накладной</h1>
          <div className="count_number">№</div>
          <Tabs defaultActiveKey="1" onChange={onChange}>
            <TabPane tab="УЗБ" key="1">
              <Form />
            </TabPane>
            <TabPane tab="ИРА" key="2">
              sa
            </TabPane>
            <TabPane tab="ТРК" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </div>
        <div className="overhead-right">информация о заказе</div>
      </div>
      <div className="bg-dark" />
    </div>
  );
}
