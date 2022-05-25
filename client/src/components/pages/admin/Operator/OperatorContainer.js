import React, { Component } from "react";
import axiosInter from "./../../../../utils/axiosInterceptors";
import { toast } from "react-toastify";
import Operator from "./Operators";

class OperatorContainer extends Component {
  state = {
    firstName: "",
    lastName: "",
    login: "",
    password: "",
    firstNameValue: "",
    lastNameValue: "",
    loginValue: "",
    passwordValue: "",
    allOperators: [],
    loading: true,
    uploadLoading: false,
    usersMaxLength: 0,
    limit: 5,
    skip: 0,
  };

  componentDidMount() {
    this.getOperators();
  }
  componentDidUpdate(prevProps, prevState) {
    const { skip: prevSkip } = prevState;
    const { skip, usersMaxLength, limit } = this.state;

    if (usersMaxLength % limit === 0 && skip > limit) {
      this.setState({
        loading: true,
        skip: 0,
      });
    }
    if (skip !== prevSkip) {
      this.setState({
        loading: true,
      });
      this.getOperators(skip);
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
    const {
      lastNameValue,
      firstNameValue,
      loginValue,
      passwordValue,
    } = this.state;

    const data = {
      lastName: lastNameValue,
      firstName: firstNameValue,
      login: loginValue,
      password: passwordValue,
    };

    await axiosInter
      .post("/api/user/register", data)
      .then(res => {
        toast.success(res.data);
        this.setState({
          uploadLoading: true,
          firstNameValue: "",
          lastNameValue: "",
          loginValue: "",
          passwordValue: "",
          firstName: "",
          lastName: "",
          login: "",
          password: "",
        });
        this.getOperators();
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

  getOperators = async () => {
    const { limit, skip } = this.state;
    await axiosInter
      .get("/api/user/", {
        params: {
          skip,
          limit,
        },
      })
      .then(res => {
        const { users, usersMaxLength } = res.data;
        this.setState({
          allOperators: users,
          usersMaxLength,
          loading: false,
          uploadLoading: false,
        });
      });
  };

  deleteOperator = async id => {
    await axiosInter.delete("/api/user/" + id).then(res => {
      toast.success(res.data);
      this.getOperators();
    });
  };
  render() {
    return (
      <Operator
        {...this.state}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        onDelete={this.deleteOperator}
        onSkip={this.handleSetSkip}
      />
    );
  }
}

export default OperatorContainer;
