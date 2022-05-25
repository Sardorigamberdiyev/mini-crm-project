import React, { Component } from "react";
import axiosInter from "./../../../../utils/axiosInterceptors";
import { toast } from "react-toastify";
import State from "./States";

class StateContainer extends Component {
  state = {
    name: "",
    cost: "",
    nameValue: "",
    costValue: "",
    skip: 0,
    limit: 10,
    statesMaxLength: 0,
    allStates: [],
    loading: true,
    uploadLoading: false,
  };

  componentDidMount() {
    this.getStates();
  }
  componentDidUpdate(prevProps, prevState) {
    const { skip: prevSkip } = prevState;
    const { skip, statesMaxLength, limit } = this.state;

    if (statesMaxLength % limit === 0 && skip > limit) {
      this.setState({
        loading: true,
        skip: 0,
      });
    }
    if (skip !== prevSkip) {
      this.setState({
        loading: true,
      });
      this.getStates(skip);
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
    const { costValue, nameValue } = this.state;

    const data = { cost: costValue, name: nameValue };

    await axiosInter
      .post("/api/state", data)
      .then(res => {
        toast.success(res.data);
        this.setState({
          uploadLoading: true,
          nameValue: "",
          costValue: "",
          name: "",
          cost: "",
        });
        this.getStates();
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

  getStates = async () => {
    const { limit, skip } = this.state;
    await axiosInter
      .get("/api/state/", {
        params: {
          skip,
          limit,
        },
      })
      .then(res => {
        const { statesMaxLength, states } = res.data;
        this.setState({
          allStates: states,
          statesMaxLength,
          loading: false,
          uploadLoading: false,
        });
      });
  };

  deleteState = async id => {
    await axiosInter.delete("/api/state/" + id).then(res => {
      toast.success(res.data);
      this.getStates();
    });
  };
  render() {
    return (
      <State
        {...this.state}
        onDelete={this.deleteState}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        onSkip={this.handleSetSkip}
      />
    );
  }
}

export default StateContainer;
