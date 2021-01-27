import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
// import the actions
import { listOrders } from "../actions/orderActions";
const OrderListScreen = ({ history }) => {
  // use dispatchHook to dispatch an action
  const dispatchHook = useDispatch();
  // use useSelector hook to get a specific state value
  // get orders from orderList state
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  // get the userLogin state so we can identify whether user is an admin user
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  useEffect(() => {
    // dispatch the listOrders action only if userInfo is present and user is an admin
    if (userInfo && userInfo.isAdmin) {
      dispatchHook(listOrders());
    } else {
      // if not an admin redirect to login page
      history.push("/login");
    }
  }, [dispatchHook, userInfo, history]);
  return (
    <>
      <h1>Orders</h1>
      {/* show a loading or error message if it exists else display the html */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                {/* if order.user exists show the order.user.name */}
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                {/* if order data is paid show the date else show red x symbol*/}
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                {/* if order is delivered show the date else show red x symbol*/}
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};
export default OrderListScreen;
