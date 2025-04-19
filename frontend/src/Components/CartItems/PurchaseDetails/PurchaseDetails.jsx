import React, { useContext, useEffect, useState } from "react";
import "./PurchaseDetails.css";
import { ShopContext } from "../../../Context/ShopContext";

const PurchaseDetails = () => {
    const [addresses, setAddresses] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editedAddress, setEditedAddress] = useState({});
    const { getTotalCartAmount, all_product, cartItems } = useContext(ShopContext);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch("http://localhost:4000/getaddress", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch address");
                }

                const data = await response.json();
                if (data.address) {
                    setAddresses([{ address: data.address }]); // Ensure correct structure
                } else {
                    setAddresses([]); // Set empty array if no address is returned
                }
            } catch (error) {
                console.error("Error fetching address details:", error);
                setAddresses([]); // Handle error by setting an empty array
            }
        };

        fetchAddress();
    }, []);

    const handleEditClick = (index) => {
        setEditIndex(index);
        setEditedAddress(addresses[index].address);
    };

    const handleInputChange = (e, field) => {
        setEditedAddress({ ...editedAddress, [field]: e.target.value });
    };

    const handleSave = async (index) => {
        try {
            const token = localStorage.getItem("auth-token"); // Include the auth-token for authentication
            const response = await fetch("http://localhost:4000/updateaddress", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token, // Pass the token in the headers
                },
                body: JSON.stringify(editedAddress), // Send the edited address directly
            });
    
            if (!response.ok) {
                throw new Error("Failed to update address");
            }
    
            const data = await response.json();
    
            if (data.success) {
                const updatedAddresses = [...addresses];
                updatedAddresses[index].address = editedAddress; // Update the address locally
                setAddresses(updatedAddresses);
                setEditIndex(null);
            } else {
                console.error("Address update failed:", data.message);
            }
        } catch (error) {
            console.error("Error updating address:", error);
        }
    };

    return (
        <div className="purchase-details">
            <h1>Purchase</h1>
            {addresses && addresses.length > 0 ? (
                addresses.map((user, index) => (
                    <div key={index} className="address-details">
                        {user.address && ( // Add null check for user.address
                            editIndex === index ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editedAddress.fullAddress || ""}
                                        onChange={(e) => handleInputChange(e, "fullAddress")}
                                    />
                                    <input
                                        type="text"
                                        value={editedAddress.street || ""}
                                        onChange={(e) => handleInputChange(e, "street")}
                                    />
                                    <input
                                        type="text"
                                        value={editedAddress.city || ""}
                                        onChange={(e) => handleInputChange(e, "city")}
                                    />
                                    <input
                                        type="text"
                                        value={editedAddress.district || ""}
                                        onChange={(e) => handleInputChange(e, "district")}
                                    />
                                    <input
                                        type="text"
                                        value={editedAddress.state || ""}
                                        onChange={(e) => handleInputChange(e, "state")}
                                    />
                                    <input
                                        type="text"
                                        value={editedAddress.pincode || ""}
                                        onChange={(e) => handleInputChange(e, "pincode")}
                                    />
                                    <input
                                        type="text"
                                        value={editedAddress.phoneNumber || ""}
                                        onChange={(e) => handleInputChange(e, "phoneNumber")}
                                    />
                                    <button onClick={() => handleSave(index)}>Save</button>
                                </div>
                            ) : (
                                <div className="change-btn">
                                    <p>
                                        {user.address.fullAddress}, {user.address.street}, {user.address.city},{" "}
                                        {user.address.district}, {user.address.state}, {user.address.pincode},{" "}
                                        {user.address.phoneNumber}
                                    </p>
                                    <button onClick={() => handleEditClick(index)}>Change</button>
                                </div>
                            )
                        )}
                    </div>
                ))
            ) : (
                <p>No address found.</p>
            )}

            <div className="cartitems">
                <div className="cartitems-format-main">
                    <p>Products</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                </div>
                <hr />
                {all_product.map((e) => {
                    if (cartItems[e.id] > 0) {
                        return (
                            <div key={e.id}>
                                <div className="cartitems-format cartitems-format-main">
                                    <img src={e.image} alt="" className="carticon-product-icon" />
                                    <p>{e.name}</p>
                                    <p>₹{e.new_price}</p>
                                    <button className="cartitems-quantity">{cartItems[e.id]}</button>
                                    <p>₹{e.new_price * cartItems[e.id]}</p>
                                </div>
                                <hr />
                            </div>
                        );
                    }
                    return null;
                })}

                <div className="cartitems-down">
                    <div className="cartitems-total">
                        <h1>Cart Totals</h1>
                        <div>
                            <div className="cartitems-total-item">
                                <p>SubTotal</p>
                                <p>₹{getTotalCartAmount()}</p>
                            </div>
                            <hr />
                            <div className="cartitems-total-item">
                                <p>Shipping Fee</p>
                                <p>₹100</p>
                            </div>
                            <hr />
                            <div className="cartitems-total-item">
                                <h3>Total</h3>
                                <h3>₹{getTotalCartAmount() + 100}</h3>
                            </div>
                        </div>
                        <button>PURCHASE</button>
                    </div>
                </div>
            </div>
            <button className="purchase-history-btn">Purchase History</button>
        </div>
    );
};

export default PurchaseDetails;