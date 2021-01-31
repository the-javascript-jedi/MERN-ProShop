import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { listProducts } from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { Link } from "react-router-dom";
// import meta component
import Meta from "../components/Meta";

const HomeScreen = (props) => {
  const { match } = props;
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;
  //useDispatch() is a react hook used instead of higher order method like connect, mapStateToProps
  const dispatchHook = useDispatch();
  //useSelector hook is used for selecting the necessary state
  //productList state is specfied with the same name in the store within combineReducers
  const productList = useSelector((state) => state.productList);
  // 5- destructure data received from productList through redux
  const { loading, error, products, page, pages } = productList;
  useEffect(() => {
    //1-we fire a dispatch to listProducts() Action
    // pass keyord and pageNumber for search and pagination functionality
    dispatchHook(listProducts(keyword, pageNumber));
  }, [dispatchHook, keyword, pageNumber]);

  return (
    <>
      {/* Helmet component using default props */}
      <Meta />
      {/* show carousel only if no search term is present */}
      {/* show back button if search results are displaying - wlse condition of not showing a carousel */}
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {/* loading spinner */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => {
              return (
                <Col key={product._id} sm={12} md={6} lg={4}>
                  <Product product={product} />
                </Col>
              );
            })}
          </Row>
          {/* if keyword exists use the keyword */}
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          ></Paginate>
        </>
      )}
    </>
  );
};
export default HomeScreen;
