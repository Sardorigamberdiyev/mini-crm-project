import React, { Component } from "react";
import axiosInter from "./../../../utils/axiosInterceptors";
import Axios from "axios";
import FileDownload from "js-file-download";
import Order from "./Order";

class OrderContainer extends Component {
  state = {
    limit: 12,
    skip: 0,
    term: "",
    startDate: "",
    endDate: "",
    orders: [],
    ordersMaxLength: 0,
    loading: true,
  };
  ref = React.createRef(true);
  ref = true;
  componentDidMount() {
    if (this.ref) {
      this.getOrders();
      this.getStatistics();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      term: prevTerm,
      startDate: prevStart,
      endDate: prevEnd,
      skip: prevSkip,
    } = prevState;
    const {
      term,
      startDate,
      endDate,
      skip,
      limit,
      ordersMaxLength,
    } = this.state;
    if (term !== prevTerm || startDate !== prevStart || endDate !== prevEnd) {
      this.getOrders();
    }
    if (ordersMaxLength % limit === 0 && skip > limit) {
      this.setState({
        loading: true,
        skip: 0,
      });
    }
    if (skip !== prevSkip) {
      this.setState({
        loading: true,
      });
      this.getOrders();
    }
  }

  componentWillUnmount() {
    this.ref = false;
  }

  getStatistics = async () => {
    await axiosInter.get("/api/order/statistics").then(res => {
      console.log(res.data);
    });
  };
  getOrders = async () => {
    const { skip, limit, startDate, endDate, term } = this.state;
    await axiosInter
      .get("/api/order", {
        params: {
          skip,
          limit,
          term,
          startDate,
          endDate,
        },
      })
      .then(res => {
        const { orders, ordersMaxLength } = res.data;
        if (this.ref)
          this.setState({
            orders,
            ordersMaxLength,
            loading: false,
          });
      });
  };
  handelDateChange = (date, dateString) => {
    const [arr1, arr2] = dateString;
    let [year1, month1, day1] = arr1.split("-");
    let [year2, month2, day2] = arr2.split("-");

    const startDate = new Date(year1, month1 - 1, day1, 0, 0, 0);
    const endDate = new Date(year2, month2 - 1, day2, 23, 59, 59, 999);

    this.setState({
      startDate,
      endDate,
    });
  };

  getExel = () => {
    const { startDate, endDate } = this.state;
    Axios({
      url: "api/order/xlsx",
      method: "GET",
      responseType: "blob",
      params: {
        startDate,
        endDate,
      },
    }).then(res => {
      FileDownload(res.data, "data.xlsx");
    });
  };
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSetSkip = value => {
    const { limit } = this.state;
    let skip = (value - 1) * limit;
    this.setState({
      skip,
    });
  };
  render() {
    return (
      <Order
        {...this.state}
        dateChange={this.handelDateChange}
        onChange={this.handleChange}
        getOrders={this.getOrders}
        onSkip={this.handleSetSkip}
        getExel={this.getExel}
      />
    );
  }
}

export default OrderContainer;
