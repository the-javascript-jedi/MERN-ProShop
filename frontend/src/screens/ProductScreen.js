import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
// listProductDetails action
import { listProductDetails } from "../actions/productActions";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";

// match A match object contains information about how a <Route path> matched the URL.
const ProductScreen = ({ history, match }) => {
  // state hook
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  // use the useSelector hook to get the data from the redux state
  const productDetails = useSelector((state) => state.productDetails);

  const { loading, error, product } = productDetails;
  useEffect(() => {
    // dispatch an action to listProductDetails action with the id of the product
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match]);
  // event handlers below useEffect
  const addToCartHandler = () => {
    // navigate to Cart page
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  return (
    <>
      <Link className="btn btn-dark my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            {/* variant="flush" - removes the margin */}
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
            </ListGroup>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>Description: ${product.description}</ListGroup.Item>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out of stock"}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {/* if product is in stock show the quantity dropdown*/}
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        {/* Quantity Dropdown */}
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {/*y=[Array(5)]->create new array with 5 values using array keyword */}
                          {/* The keys() method returns a new Array Iterator object that contains the keys for each index in the array */}
                          {/* .keys will display array values with number of values - eg [0,1,2,3,4,5] */}
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                {/* add to cart button */}
                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock === 0}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};
export default ProductScreen;
