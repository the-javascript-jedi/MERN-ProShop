import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import axios from "axios";
const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  //make GET request
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("/api/products");
      //can be destructured as const {data}
      setProducts(res.data);
    };
    //since we want to use async/await inside useEffect, we need to create a separate async fn inside useEffect and call that function
    fetchProducts();
  }, []);
  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => {
          return (
            <Col key={product._id} sm={12} md={6} lg={4}>
              <Product product={product} />
            </Col>
          );
        })}
      </Row>
    </>
  );
};
export default HomeScreen;
