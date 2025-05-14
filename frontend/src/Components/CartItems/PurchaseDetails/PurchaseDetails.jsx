import React, { useContext, useEffect, useState } from "react";
import "./PurchaseDetails.css";
import { ShopContext } from "../../../Context/ShopContext";

const PurchaseDetails = () => {
    const [addresses, setAddresses] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editedAddress, setEditedAddress] = useState({});
    const [purchases, setPurchases] = useState([]);
    const { getTotalCartAmount, all_product, cartItems,removeFromCart} = useContext(ShopContext);

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

                const data = await response.json();
                setAddresses(data.address ? [{ address: data.address }] : []);
            } catch (error) {
                console.error("Error fetching address details:", error);
                setAddresses([]);
            }
        };

const fetchPurchases = async () => {
    try {
        const token = localStorage.getItem("auth-token");

        if (!token) {
            setPurchases([]);
            return;
        }

        const response = await fetch("http://localhost:4000/purchase-details", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
        });

        const data = await response.json();

        if (response.ok && data.success && Array.isArray(data.purchases)) {
            const validPurchases = data.purchases.filter(
                (p) => p && typeof p === "object" && p.date
            );
            setPurchases(validPurchases);
        } else {
            setPurchases([]);
        }
    } catch (error) {
        setPurchases([]);
    }
};

        fetchAddress();
        fetchPurchases();
    }, []);

    const handleEditClick = (index) => {
        setEditIndex(index);
        setEditedAddress(addresses[index].address);
    };

    const handleInputChange = (e, field) => {
        setEditedAddress({ ...editedAddress, [field]: e.target.value });
    };

    const handleSave = async (index) => {
        const { fullAddress, street, city, district, state, pincode, phoneNumber } = editedAddress;
        if (!fullAddress || !street || !city || !district || !state || !pincode || !phoneNumber) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const token = localStorage.getItem("auth-token");
            const response = await fetch("http://localhost:4000/updateaddress", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
                body: JSON.stringify(editedAddress),
            });

            const data = await response.json();
            if (data.success) {
                const updatedAddresses = [...addresses];
                updatedAddresses[index].address = editedAddress;
                setAddresses(updatedAddresses);
                setEditIndex(null);
            } else {
                alert("Failed to update address: " + data.message);
            }
        } catch (error) {
            console.error("Error updating address:", error);
        }
    };

    const handlePurchase = async () => {
        const purchasedItems = [];

        for (const productId in cartItems) {
            if (cartItems[productId] > 0) {
                const product = all_product.find((p) => p.id === parseInt(productId));
                if (product) {
                    purchasedItems.push({
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        category: product.category,
                        new_price: product.new_price,
                        old_price: product.old_price,
                        description: product.description,
                        quantity: cartItems[productId],
                    });
                }
            }
        }

        if (purchasedItems.length === 0) {
            alert("No items in cart to purchase.");
            return;
        }

        try {
            const token = localStorage.getItem("auth-token");
            const response = await fetch("http://localhost:4000/purchase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
                body: JSON.stringify({
                    items: purchasedItems,
                    totalAmount: getTotalCartAmount() + 100,
                    address: addresses[0]?.address,
                }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Purchase successful!");
                setPurchases((prev) => [...prev, data.purchase]);
                all_product.forEach((e) => {
                if (cartItems[e.id] > 0) {
                removeFromCart(e.id);
                }
                });
            } else {
                alert("Purchase failed: " + data.message);
            }
        } catch (error) {
            console.error("Purchase error:", error);
            alert("An error occurred during purchase.");
        }
    };

    const handleCancelPurchase = async (purchaseId) => {
        try {
            const token = localStorage.getItem("auth-token");
            const response = await fetch(`http://localhost:4000/cancelpurchase/${purchaseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
            });

            const data = await response.json();
            if (data.success) {
                alert("Purchase cancelled successfully.");
                setPurchases((prev) =>
                    prev.map((p) => (p._id === purchaseId ? { ...p, isCancelled: true } : p))
                );
            } else {
                alert("Failed to cancel purchase: " + data.message);
            }
        } catch (error) {
            console.error("Error cancelling purchase:", error);
            alert("An error occurred while cancelling.");
        }
    };

    const handleUndoCancelPurchase = async (purchaseId) => {
        try {
            const token = localStorage.getItem("auth-token");
            const response = await fetch(`http://localhost:4000/undocancelpurchase/${purchaseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
            });

            const data = await response.json();
            if (data.success) {
                alert("Cancellation undone successfully.");
                setPurchases((prev) =>
                    prev.map((p) => (p._id === purchaseId ? { ...p, isCancelled: false } : p))
                );
            } else {
                alert("Failed to undo cancellation: " + data.message);
            }
        } catch (error) {
            console.error("Error undoing cancellation:", error);
            alert("An error occurred while undoing cancellation.");
        }
    };

    return (
        <div className="purchase-details">
            <h1>Purchase</h1>

            {addresses && addresses.length > 0 ? (
                addresses.map((user, index) => (
                    <div key={index} className="address-details">
                        {editIndex === index ? (
                            <div>
                                <input type="text" value={editedAddress.fullAddress || ""} onChange={(e) => handleInputChange(e, "fullAddress")} placeholder="Full Address" />
                                <input type="text" value={editedAddress.street || ""} onChange={(e) => handleInputChange(e, "street")} placeholder="Street" />
                                <input type="text" value={editedAddress.city || ""} onChange={(e) => handleInputChange(e, "city")} placeholder="City" />
                                <input type="text" value={editedAddress.district || ""} onChange={(e) => handleInputChange(e, "district")} placeholder="District" />
                                <input type="text" value={editedAddress.state || ""} onChange={(e) => handleInputChange(e, "state")} placeholder="State" />
                                <input type="text" value={editedAddress.pincode || ""} onChange={(e) => handleInputChange(e, "pincode")} placeholder="Pincode" />
                                <input type="text" value={editedAddress.phoneNumber || ""} onChange={(e) => handleInputChange(e, "phoneNumber")} placeholder="Phone Number" />
                                <button onClick={() => handleSave(index)}>Save</button>
                            </div>
                        ) : (
                            <div className="change-btn">
                                <p>
                                    {user.address.fullAddress}, {user.address.street}, {user.address.city}, {user.address.district}, {user.address.state}, {user.address.pincode}, {user.address.phoneNumber}
                                </p>
                                <button onClick={() => handleEditClick(index)}>Change</button>
                            </div>
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
                {all_product.map((e) =>
                    cartItems[e.id] > 0 ? (
                        <div key={e.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt={e.name} className="carticon-product-icon" />
                                <p>{e.name}</p>
                                <p>₹{e.new_price}</p>
                                <button className="cartitems-quantity">{cartItems[e.id]}</button>
                                <p>₹{e.new_price * cartItems[e.id]}</p>
                            </div>
                            <hr />
                        </div>
                    ) : null
                )}

                <div className="cartitems-down">
                    <div className="cartitems-total">
                        <h1>Cart Totals</h1>
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
                        <button onClick={handlePurchase}>PURCHASE</button>
                    </div>
                </div>
            </div>

            <div className="purchase-history">
                <h2>Previous Purchases</h2>
                {purchases.length === 0 ? (
                    <p>No purchases found.</p>
                ) : (
                    purchases
                    .filter(p => p && typeof p === "object" && p.date)
                    .map((purchase) => {
                        const formattedDate = purchase.date? new Date(purchase.date).toLocaleString() : "Unknown";
                        const productNames = Array.isArray(purchase.products) ? purchase.products.map(item => item.name).join(", ") : "N/A";
                        return (
                            <div key={purchase._id} className="purchase-entry">
                                <p><strong>Products:</strong> {productNames}</p>
                                <p><strong>Date:</strong> {formattedDate}</p>
                                <p><strong>Total:</strong> ₹{purchase.totalAmount}</p>
                                <p><strong>Status:</strong> {purchase.isCancelled ? "Cancelled" : "Active"}</p>
                                {purchase.isCancelled ? (
                                    <button onClick={() => handleUndoCancelPurchase(purchase._id)}>Undo Cancel</button>
                                ) : (
                                    <button onClick={() => handleCancelPurchase(purchase._id)}>Cancel</button>
                                )}
                                <hr />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PurchaseDetails;