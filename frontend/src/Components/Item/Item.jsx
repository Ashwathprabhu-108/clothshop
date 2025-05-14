import React from 'react';
import "./Item.css";
import { Link } from 'react-router-dom';

const Item = (props) => {
  
  console.log("Item props:", props);
  return (
    <div className='item'>
      {props.available ? (
        <Link to={`/product/${props.id}`}>
          <img onClick={() => window.scrollTo(0, 0)} src={props.image} alt={props.name} />
        </Link>
      ) : (
        <img src={props.image} alt={props.name} style={{ opacity: 0.5, cursor: "not-allowed" }} />
      )}
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">₹{props.new_price}</div>
        <div className="item-price-old">₹{props.old_price}</div>
      </div>
      <p>Available: {props.available ? "Yes" : "No"}</p>
    </div>
  );
};

export default Item;