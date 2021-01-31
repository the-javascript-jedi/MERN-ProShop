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
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
// import constants for dispatching reset
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
// import meta tag
import Meta from "../components/Meta";
// match A match object contains information about how a <Route path> matched the URL.
const ProductScreen = ({ history, match }) => {
  // state hook
  const [qty, setQty] = useState(1);
  const [ratingFromState, setRatingFromState] = useState(0);
  const [commentFromState, setCommentFromState] = useState("");
  const dispatch = useDispatch();
  // use the useSelector hook to get the data from the redux state
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  //bring the productReviewCreate from state
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    error: errorProductReview,
  } = productReviewCreate;
  // bring the user info state to make sure user is logged in
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  useEffect(() => {
    // if review is submitted successfully reset the rating and comments
    if (successProductReview) {
      alert("Review Submitted");
      setRatingFromState(0);
      setCommentFromState("");
      // dispatch the reset state
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    // dispatch an action to listProductDetails action with the id of the product
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match, successProductReview]);
  // event handlers below useEffect
  const addToCartHandler = () => {
    // navigate to Cart page
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };
  // submit review event handler
  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch an action using created dispatch hook
    //pass the product id from params and rating and comment as an object
    dispatch(
      createProductReview(match.params.id, {
        rating: ratingFromState,
        comment: commentFromState,
      })
    );
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
        <>
          {/* Meta tag after productloads we pass in product name in title */}
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
              <Meta title={product.name} />
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
              <ListGroup.Item>
                Description: ${product.description}
              </ListGroup.Item>
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
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
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
          {/* row for product reviews */}
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {/* show message if no reviews are present */}
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              {/* show the reviews */}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item keu={review._id}>
                    <strong>{review.name}</strong>
                    {/*review rating component */}
                    <Rating value={review.rating}></Rating>
                    {/*review created at */}
                    <p>{review.createdAt.substring(0, 10)}</p>
                    {/*review comment */}
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                {/* Write a customer review section - only allow logged in users to write a review */}
                <ListGroup.Item>
                  <h2>Write a customer review</h2>
                  {/* check for error when entering review */}
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      {/* Add Rating Dropdown */}
                      <Form.Group>
                        <Form.Label>
                          <Form.Control
                            controlId="rating"
                            as="select"
                            value={ratingFromState}
                            onChange={(e) => setRatingFromState(e.target.value)}
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Control>
                        </Form.Label>
                      </Form.Group>
                      {/* Add Comment Section */}
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={commentFromState}
                          onChange={(e) => setCommentFromState(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type="submit" variant="primary">
                        Submit Review
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
export default ProductScreen;
