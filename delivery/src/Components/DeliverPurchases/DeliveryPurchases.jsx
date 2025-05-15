import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DeliveryPurchases.css';

const DeliveryPurchases = () => {
  const { deliveryId } = useParams();
  const [purchaseData, setPurchaseData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchMatchingPurchases = async () => {
      try {
        console.log("Fetching purchases for deliveryId:", deliveryId);

        const response = await fetch(`http://localhost:4000/fetch-matching-purchases/${deliveryId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setErrorMessage('No matching purchases found or delivery user not found.');
          } else {
            setErrorMessage(`Error: HTTP status ${response.status}`);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setPurchaseData(data.purchases);
          setErrorMessage('');
        } else {
          setErrorMessage(data.message || 'Failed to fetch matching purchases.');
          console.error('Error fetching matching purchases:', data.message);
        }
      } catch (error) {
        console.error('Error fetching matching purchases:', error);
        setErrorMessage('An error occurred while fetching matching purchases.');
      }
    };

    if (deliveryId) {
      fetchMatchingPurchases();
    }
  }, [deliveryId]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedUser(null); // Clear user details when a product is selected
  };

  const handleUserClick = (user, address) => {
    setSelectedUser({ ...user, address });
    setSelectedProduct(null); // Clear product details when a user is selected
  };

  return (
    <div className='purchase-details'>
      <h1>Purchase Details</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {purchaseData.length > 0 ? (
        <div className="purchase-section">
          <table className="purchase-table">
            <thead>
              <tr>
                <th>Products</th>
                <th>User</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {purchaseData.map(purchase => (
                <tr key={purchase._id}>
                  <td>
                    {purchase.products.map(product => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="clickable"
                      >
                        <img src={product.image} alt={product.name} className="purchase-product-icon" />
                        <p>{product.name}</p>
                      </div>
                    ))}
                  </td>
                  <td
                    onClick={() => handleUserClick(purchase.user, purchase.address)}
                    className="clickable"
                  >
                    {purchase.user.name} ({purchase.user.email})
                  </td>
                  <td>₹{purchase.totalAmount}</td>
                  <td>{purchase.isCancelled ? 'Cancelled' : purchase.status}</td>
                  <td>{new Date(purchase.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !errorMessage && <p>No purchases found.</p>
      )}
      {selectedProduct && (
        <div className="details-modal">
          <h2>Product Details</h2>
          <p><strong>Name:</strong> {selectedProduct.name}</p>
          <p><strong>Category:</strong> {selectedProduct.category}</p>
          <p><strong>Price:</strong> ₹{selectedProduct.new_price}</p>
          <p><strong>Description:</strong> {selectedProduct.description}</p>
          <button onClick={() => setSelectedProduct(null)}>Close</button>
        </div>
      )}
      {selectedUser && (
        <div className="details-modal">
          <h2>User Details</h2>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Address:</strong></p>
          <p>{selectedUser.address.fullAddress}</p>
          <p>{selectedUser.address.street}, {selectedUser.address.city}</p>
          <p>{selectedUser.address.district}, {selectedUser.address.state} - {selectedUser.address.pincode}</p>
          <p><strong>Phone:</strong> {selectedUser.address.phoneNumber}</p>
          <button onClick={() => setSelectedUser(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default DeliveryPurchases;