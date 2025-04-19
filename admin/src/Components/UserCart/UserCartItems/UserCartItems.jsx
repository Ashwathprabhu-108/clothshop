import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './UserCartItems.css';

const UserCartItems = () => {
  const location = useLocation();
  const userEmail = location.state?.email;
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://localhost:4000/getallcartdetails');
        const data = await response.json();

        const userCart = data.find(user => user.email === userEmail);
        setCartData(userCart ? userCart.cart : []);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (userEmail) {
      fetchCartItems();
    }
  }, [userEmail]);

  return (
    <div className='usercartitems'>
      <h1>Cart Items</h1>
      <div className="usercart-items-head">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
      </div>

      {cartData.length > 0 ? (
        <div className="user-cart-section">
          <h2>Total: ₹{cartData.reduce((acc, item) => acc + item.new_price * item.quantity, 0)}</h2>
          {cartData.map(item => (
            <div className="cart-items" key={item.productId}>
              <img src={item.image} alt={item.name} className="cart-icon" />
              <p>{item.name}</p>
              <p>₹{item.new_price}</p>
              <button className="cart-quantity">{item.quantity}</button>
              <p>₹{item.new_price * item.quantity}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
  );
};

export default UserCartItems;
