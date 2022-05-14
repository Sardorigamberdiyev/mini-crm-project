import React, { useEffect } from "react";
import { ChangeMenu } from "../../../actions";
import { useDispatch } from "react-redux";
import './order.css'

export default function Order() {

  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(ChangeMenu('order'))
  },[dispatch])

  return <div>Order</div>;
}
