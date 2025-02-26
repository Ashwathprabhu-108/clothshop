import React, { useEffect, useState } from 'react';
import './UserCartItems.css';

const UserCartItems = () => {
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://localhost:4000/getallcartdetails');
        const data = await response.json();
        setCartData(data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

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

      {cartData.map(user => {
        const userTotal = user.cart.reduce((acc, item) => acc + (item.new_price * item.quantity), 0);
        return (
          <div key={user.email} className="user-cart-section">
            <h2>Total: ₹{userTotal}</h2>
            {user.cart.map(item => (
              <div className="cart-items" key={item.productId}>
                <img src={item.image} alt={item.name} className="cart-icon" />
                <p>{item.name}</p>
                <p>₹{item.new_price}</p>
                <button className="cart-quantity">{item.quantity}</button>
                <p>₹{item.new_price * item.quantity}</p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default UserCartItems;