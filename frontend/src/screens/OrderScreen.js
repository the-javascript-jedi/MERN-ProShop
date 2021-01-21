import React, { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import axios from "axios";
// import paypal button
import { PayPalButton } from "react-paypal-button-v2";
// createOrder action
import {
  createOrder,
  getOrderDetails,
  payOrder,
} from "../actions/orderActions";
// import constants
import { ORDER_PAY_RESET } from "../constants/orderConstants";
const OrderScreen = ({ match }) => {
  // get order id from url
  const orderId = match.params.id;
  // state values
  // show loader based on sdkReady value
  const [sdkReady, setSdkReady] = useState(false);
  // dispatch an action using useDispatch hook
  const dispatchHook = useDispatch();
  // select the necessary state using useSelector from store
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  //select orderPay
  const orderPay = useSelector((state) => state.orderPay);
  // rename loading to loadingPay and success to successPay destructured from orderPay respectively
  const { loading: loadingPay, success: successPay } = orderPay;
  console.log("order--OrderScreen.js", order);
  useEffect(() => {
    const addPayPalScript = async () => {
      // fetch the clientId from backend
      const { data: clientId } = await axios.get("/api/config/paypal");
      console.log("clientId", clientId);
      // create the paypal script dynamically
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    // temporarilty call paypal script for testing purpose
    //addPayPalScript();
    //   check for the order id and aso if the order id matches the id in the url
    // successPay - dispatch request if the order has successfully been paid
    if (!order || order._id !== orderId || successPay) {
      // dispatch ORDER_PAY_RESET to reset the state else we will get a never ending loop from
      // if we do not reset once we pay page will keep refreshing
      dispatchHook({ type: ORDER_PAY_RESET });
      // dispatch getOrderDetails
      dispatchHook(getOrderDetails(orderId));
    }
    // if order is not paid
    else if (!order.isPaid) {
      // check if paypal script is not there
      if (!window.paypal) {
        addPayPalScript();
      }
    } else {
      setSdkReady(true);
    }
    // we add the below line to hide the warning because order._id does not exist yet
    // eslint-disable-next-line
  }, [dispatchHook, order, orderId, successPay]);
  // function to round decimal places to two numbers
  //.2=>.20, .25=>.25
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  // check if loading is complete
  if (!loading) {
    // calculate prices
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    // calculate shipping
    order.shippingPrice = addDecimals(order.itemsPrice > 100 ? 0 : 100);
    // calculate taxprice
    order.taxPrice = addDecimals(Number((0.15 * order.itemsPrice).toFixed(2)));
  }
  // paypal success event handler will receive the paymentResult status
  const successPaymentHandler = (paymentResult) => {
    console.log("paymentResult", paymentResult);
    // dispatch the payOrder action here
    dispatchHook(payOrder(orderId, paymentResult));
  };
  // html content to be displayed if no error and loading is false
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Shipping */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.addressFromState},
                {order.shippingAddress.cityFromState},
                {order.shippingAddress.postalCodeFromState},
                {order.shippingAddress.countryFromState},
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.DeliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            {/* Payment Method */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            {/* Order Items */}
            <ListGroup.Item>
              <h2>Order Items</h2>
              {/* check if items are present in the order */}
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {/* for each cart item render a list group item */}
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price}=${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Item</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* show paypal button if order is not paid */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {/* show loader if loadingPay is true */}
                  {loadingPay && <Loader />}
                  {/* if paypal sdk is not ready show loader */}
                  {/* pass amount and a success handler to the PayPalButton */}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
