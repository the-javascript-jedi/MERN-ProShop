import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
// register action
import { getUserDetails, updateUserProfile } from "../actions/userActions";
// list orders action
import { listMyOrders } from "../actions/orderActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
const ProfileScreen = ({ location, history }) => {
  const [nameFromState, setNameFromState] = useState("");
  const [emailFromState, setEmailFromState] = useState("");
  const [passwordFromState, setPasswordFromState] = useState("");
  const [confirmPasswordFromState, setConfirmPasswordFromState] = useState("");
  const [messageFromState, setMessageFromState] = useState(null);
  const dispatchHook = useDispatch();
  // select the necessary state using useDispatch Hook from store
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  //   check if the user is logged in
  // select the necessary state using useDispatch Hook from store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  // we can get the success value from userUpdateProfile state.
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;
  // order List state using useDispatch hook
  const orderListMy = useSelector((state) => state.orderListMy);
  // rename loading as loadingOrders and error as errorOrders
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  // redirect if user is not logged in to the login page
  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      // check for user details user name
      if (!user || !user.name || success) {
        // reset the update user profile state
        dispatchHook({ type: USER_UPDATE_PROFILE_RESET });
        //getUserDetails action takes in an id but in this scenario we pass in the text profile so in the action the /api/users/profile route will be hit instead of /api/users/id
        dispatchHook(getUserDetails("profile"));
        // dispatch the listMyOrders
        dispatchHook(listMyOrders());
      } else {
        setNameFromState(user.name);
        setEmailFromState(user.email);
      }
    }
    // to update the form values we need to add user as a dependency to useEffect so when the user field is updated the form is updated
  }, [dispatchHook, history, userInfo, user, success]);
  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    if (passwordFromState !== confirmPasswordFromState) {
      setMessageFromState("Passwords do not match");
    } else {
      // DISPATCH UPDATE PROFILE Action
      dispatchHook(
        updateUserProfile({
          id: user._id,
          name: nameFromState,
          email: emailFromState,
          password: passwordFromState,
        })
      );
    }
  };
  return (
    <Row>
      <Col md={3}>
        <h2>user Profile</h2>
        {messageFromState && (
          <Message variant="danger">{messageFromState}</Message>
        )}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">Profile Update</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          {/* Name */}
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter Name"
              value={nameFromState}
              onChange={(e) => setNameFromState(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* Email */}
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={emailFromState}
              onChange={(e) => setEmailFromState(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* Password */}
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={passwordFromState}
              onChange={(e) => setPasswordFromState(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* Password */}
          <Form.Group controlId="password">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPasswordFromState}
              onChange={(e) => setConfirmPasswordFromState(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {/* show loader if loadingOrders True */}
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
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
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  {/* display if the order is paid */}
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  {/* display if the order is delivered */}
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm" variant="light">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};
export default ProfileScreen;
