import React, { useEffect, useState } from 'react';
import './PurchaseDetails.css';

const PurchaseDetails = () => {
  const [purchaseData, setPurchaseData] = useState([]);

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        const response = await fetch('http://localhost:4000/purchase-details');
        const data = await response.json();

        if (data.success) {
          setPurchaseData(data.purchases);
        } else {
          console.error('Error fetching purchase details:', data.message);
        }
      } catch (error) {
        console.error('Error fetching purchase details:', error);
      }
    };

    fetchPurchaseDetails();
  }, []);

  return (
    <div className='purchase-details'>
      <h1>Purchase Details</h1>
      {purchaseData.length > 0 ? (
        <div className="purchase-section">
          <table className="purchase-table">
            <thead>
              <tr>
                <th>Products</th>
                <th>User</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Delivered</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {purchaseData.map(purchase => (
                <tr key={purchase._id}>
                  <td>
                    {purchase.products.map(product => (
                      <div key={product.id}>
                        <img src={product.image} alt={product.name} className="purchase-product-icon" />
                        <p>{product.name}</p>
                      </div>
                    ))}
                  </td>
                  <td>{purchase.user.name} ({purchase.user.email})</td>
                  <td>₹{purchase.totalAmount}</td>
                  <td>{purchase.isCancelled ? 'Cancelled' : purchase.status}</td>
                  <td>{purchase.delivered ? 'Yes' : 'No'}</td>
                  <td>{new Date(purchase.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No purchases found.</p>
      )}
    </div>
  );
};

export default PurchaseDetails;