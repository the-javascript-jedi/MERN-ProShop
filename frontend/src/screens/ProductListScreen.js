import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
// import the actions
import { listProducts, deleteProduct } from "../actions/productActions";
const ProductListScreen = ({ history, match }) => {
  // use dispatchHook to dispatch an action
  const dispatchHook = useDispatch();
  // use useSelector hook to get a specific state value
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  // get success value from productDelete state
  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  // get the userLogin state so we can identify whether user is an admin user
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  //console.log("userInfo--ProductListScreen.js", userInfo);
  useEffect(() => {
    // if userInfo is present and user is an admin and dispatch the listProducts action
    //successDelete is passed as a dependency to useEffect so that after successful delete the listProducts() action is dispatched again
    if (userInfo && userInfo.isAdmin) {
      dispatchHook(listProducts());
    } else {
      // if not an admin redirect to login page
      history.push("/login");
    }
  }, [dispatchHook, userInfo, history, successDelete]);
  // delete handler
  const deleteHandler = (id) => {
    console.log("deleteHandler id", id);
    // dispatch the delete action with the id
    // DELETE Products
    if (window.confirm("Are you sure?")) {
      dispatchHook(deleteProduct(id));
    }
  };
  //   create handler
  const createProductHandler = (product) => {
    //CREATE Product
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i>
            Create Product
          </Button>
        </Col>
      </Row>
      {/* show loading or error message when delete action is executed */}
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
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
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* map through the products */}
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};
export default ProductListScreen;
