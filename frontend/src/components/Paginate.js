import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
// pages-total no of pages,
const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  // if pages are greater than 1 show pagination
  return (
    pages > 1 && (
      <Pagination>
        {/* take the no of pages and map through it as an array */}
        {
          //create an array with the number of elements and map through it
          //console.log("Array",[...Array(pages).keys()])
          //Array O/P=>(5) [0, 1, 2, 3, 4]
          [...Array(pages).keys()].map((x) => (
            // the LinkContainer alo depends on the keyword which is passed
            <LinkContainer
              key={x + 1}
              // for pagination in admin productlist screen we need to do pagination-to routing separately
              to={
                // my product pagination routing
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : // admin pagination routing
                    `/admin/productlist/${x + 1}`
              }
            >
              {/* we pass in active if current page is equal to the page that is passed in */}
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          ))
        }
      </Pagination>
    )
  );
};

export default Paginate;
