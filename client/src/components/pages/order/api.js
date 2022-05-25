export const getOrders = async () => {
  await axiosInter.get("/api/order").then(res => {
    const { orders, ordersMaxLength } = res.data;
    return {
      orders,
      ordersMaxLength,
    };
  });
};
