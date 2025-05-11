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
      {cartData.length > 0 ? (
        <div className="user-cart-section">
          <h2>Total: ₹{cartData.reduce((acc, item) => acc + item.new_price * item.quantity, 0)}</h2>
          <table className="usercart-table">
            <thead>
              <tr>
                <th>Products</th>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartData.map(item => (
                <tr key={item.productId}>
                  <td>
                    <img src={item.image} alt={item.name} className="cart-icon" />
                  </td>
                  <td>{item.name}</td>
                  <td>₹{item.new_price}</td>
                  <td>
                    <button className="cart-quantity">{item.quantity}</button>
                  </td>
                  <td>₹{item.new_price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
  );
};

export default UserCartItems;