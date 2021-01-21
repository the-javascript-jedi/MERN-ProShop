import React, { useEffect } from "react";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import bread crumbs
import CheckOutSteps from "../components/CheckOutSteps";
import Message from "../components/Message";
import { Link } from "react-router-dom";
// createOrder action
import { createOrder } from "../actions/orderActions";
const PlaceOrderScreen = ({ history }) => {
  // select the necessary state using useSelector from store
  const cart = useSelector((state) => state.cart);
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;
  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
    }
    // we add the below line to hide the warning because order._id does not exist yet
    // eslint-disable-next-line
  }, [history, success]);

  // dispatch an action using useDispatch hook
  const dispatchHook = useDispatch();
  console.log("cart--PlaceOrderScreen.js", cart);
  // function to round decimal places to two numbers
  //.2=>.20, .25=>.25
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  // calculate prices
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  // calculate shipping
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  // calculate taxprice
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
  // dispatch the action event
  const placeOrderHandler = () => {
    console.log("order--PlaceOrderScreen.js");
    dispatchHook(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };
  // total price
  cart.totalPrice =
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice);
  return (
    <>
      {/* Bread Crumbs */}
      {/* step1,step2,step3,step4 will be enabled */}
      <CheckOutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Shipping */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.addressFromState},
                {cart.shippingAddress.cityFromState},
                {cart.shippingAddress.postalCodeFromState},
                {cart.shippingAddress.countryFromState},
              </p>
            </ListGroup.Item>
            {/* Payment Method */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            {/* Order Items */}
            <ListGroup.Item>
              <h2>Order Items</h2>
              {/* check if items are present in the cart */}
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {/* for each cart item render a list group item */}
                  {cart.cartItems.map((item, index) => (
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
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* error messsage if error is received */}
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <button
                  type="button"
                  className="btn-block btn btn-primary"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
