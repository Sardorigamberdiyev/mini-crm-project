import React, { Component } from "react";
import axiosInter from "./../../../utils/axiosInterceptors";
import Order from "./Order";

class OrderContainer extends Component {
  state = {
    limit: 0,
    skip: 0,
    term: "",
    startDate: "",
    endDate: "",
    orders: [],
    ordersMaxLength: 0,
  };

  componentDidMount() {
    this.getOrders();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      term: prevTerm,
      startDate: prevStart,
      endDate: prevEnd,
    } = prevState;
    const { term, startDate, endDate } = this.state;
    if (term !== prevTerm || startDate !== prevStart || endDate !== prevEnd) {
      this.getOrders();
    }
    console.log("sadasasdas");
  }

  getOrders = async () => {
    const { skip, limit, startDate, endDate, term } = this.state;
    await axiosInter
      .get("/api/order", {
        params: {
          skip,
          limit,
          startDate,
          endDate,
          term,
        },
      })
      .then(res => {
        const { orders, ordersMaxLength } = res.data;
        this.setState({
          orders,
          ordersMaxLength,
        });
        console.log(orders);
      });
  };
  handleChange = e => {
    const { name, value } = e.target;
    if (name === "term") {
      this.setState({
        [name]: value,
      });
    }
  };

  render() {
    return <Order {...this.state} onChange={this.handleChange} />;
  }
}

export default OrderContainer;
