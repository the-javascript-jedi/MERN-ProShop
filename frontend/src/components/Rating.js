import React from "react";
import PropTypes from "prop-types";

const Rating = ({ value, text, color }) => {
  return (
    <div className="rating">
      {/* 1 star */}
      <span>
        <i
          style={{ color: color }}
          className={
            //if value is greater than equal to 1 show full star
            //else if value is greater than equal to .5 show half star
            //else show empty star
            value >= 1
              ? "fas fa-star"
              : value >= 0.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      {/* 2 star */}
      <span>
        <i
          style={{ color: color }}
          className={
            //if value is greater than equal to 1 show full star
            //else if value is greater than equal to .5 show half star
            //else show empty star
            value >= 2
              ? "fas fa-star"
              : value >= 1.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      {/* 3 star */}
      <span>
        <i
          style={{ color: color }}
          className={
            //if value is greater than equal to 1 show full star
            //else if value is greater than equal to .5 show half star
            //else show empty star
            value >= 3
              ? "fas fa-star"
              : value >= 2.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      {/* 4 star */}
      <span>
        <i
          style={{ color: color }}
          className={
            //if value is greater than equal to 1 show full star
            //else if value is greater than equal to .5 show half star
            //else show empty star
            value >= 4
              ? "fas fa-star"
              : value >= 3.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      {/* 5 star */}
      <span>
        <i
          style={{ color: color }}
          className={
            //if value is greater than equal to 1 show full star
            //else if value is greater than equal to .5 show half star
            //else show empty star
            value >= 5
              ? "fas fa-star"
              : value >= 4.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      {/* <span>{text ? text : ""}</span> - shortened using &&*/}
      <span>{text && text}</span>
    </div>
  );
};
// set default props for the star colors in rating
Rating.defaultProps = {
  color: "#f8e825",
};
// prop types used to type check the props
Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
};
export default Rating;
