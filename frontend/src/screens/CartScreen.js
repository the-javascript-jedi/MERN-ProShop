import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { addToCart, removeFromCart } from "../actions/cartActions";
// match - match.params.id
// location - location.search for getting the qty value in querystring
// history -  used for redirecting
const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;
  console.log("productId", productId);
  // qty value in querystring - ?qty=1
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;
  // define dispatch hook
  const dispatchHook = useDispatch();
  //define useSelector hook
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  console.log("cart", cart);
  // if productId is present in url dispatch to action right away
  useEffect(() => {
    if (productId) {
      dispatchHook(addToCart(productId, qty));
    }
  }, [dispatchHook, productId, qty]);
  // handlers are below useEffect
  const removeFromCartHandler = (id) => {
    console.log(`remove ${id} from cart`);
    dispatchHook(removeFromCart(id));
  };
  const checkOutHandler = (id) => {
    // redirect to login unless it has a querystring set to shipping
    console.log(`checkOutHandler`);
    // if user is not logged in they will be navigated to login page, if they are logged in  they will go to shipping
    history.push("/login?redirect=shipping");
  };
  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {/* check if shopping cart is empty */}
        {cartItems.length === 0 ? (
          <Message>
            Your Cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={2}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    {/* Quantity Dropdown */}
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        // we pass to dispatch the current product id and current qty from the dropdown
                        dispatchHook(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {/*y=[Array(5)]->create new array with 5 values using array keyword */}
                      {/* The keys() method returns a new Array Iterator object that contains the keys for each index in the array */}
                      {/* .keys will display array values with number of values - eg [0,1,2,3,4,5] */}
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              {/* Total cart items */}
              {/* 0 is the initial value of the accumulator reduce function */}
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              {/* Total price of the cart items */}
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkOutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};
export default CartScreen;
