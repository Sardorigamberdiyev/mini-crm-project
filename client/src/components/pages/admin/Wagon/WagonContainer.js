import React, { Component } from "react";
import axiosInter from "./../../../../utils/axiosInterceptors";
import { toast } from "react-toastify";
import Wagon from "./Wagon";

class WagonContainer extends Component {
  state = {
    typeCarriage: "",
    typeCarriageValue: "",
    allWagons: [],
    loading: true,
    uploadLoading: false,
    carriagesMaxLength: 0,
    limit: 20,
    skip: 0,
  };

  componentDidMount() {
    this.getWagon();
  }
  componentDidUpdate(prevProps, prevState) {
    const { skip: prevSkip } = prevState;
    const { skip, carriagesMaxLength, limit } = this.state;

    if (carriagesMaxLength % limit === 0 && skip > limit) {
      this.setState({
        loading: true,
        skip: 0,
      });
    }
    if (skip !== prevSkip) {
      this.setState({
        loading: true,
      });
      this.getWagon(skip);
    }
  }
  handleSetSkip = value => {
    const { limit } = this.state;
    let skip = (value - 1) * limit;
    this.setState({
      skip,
    });
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { typeCarriageValue } = this.state;
    const data = { typeCarriage: typeCarriageValue };

    await axiosInter
      .post("/api/carriage", data)
      .then(res => {
        toast.success(res.data);
        this.setState({
          uploadLoading: true,
          typeCarriage: "",
          typeCarriageValue: "",
        });
        this.getWagon();
      })
      .catch(err => {
        const { errors } = err.response.data;
        if (errors) {
          errors.forEach(item => {
            const { param, msg } = item;
            this.setState({
              [param]: msg,
            });
          });
        } else {
          toast.error(err.response.data);
        }
      });
  };
  getWagon = async () => {
    const { limit, skip } = this.state;
    await axiosInter
      .get("/api/carriage", {
        params: {
          skip,
          limit,
        },
      })
      .then(res => {
        const { carriagesMaxLength, carriages } = res.data;
        this.setState({
          carriagesMaxLength,
          allWagons: carriages,
          loading: false,
          uploadLoading: false,
        });
      });
  };

  deleteWagon = async id => {
    await axiosInter.delete("/api/carriage/" + id).then(res => {
      toast.success(res.data);
      this.getWagon();
    });
  };

  render() {
    return (
      <Wagon
        {...this.state}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        onDelete={this.deleteWagon}
        onSkip={this.handleSetSkip}
      />
    );
  }
}

export default WagonContainer;
