import React, { useState, useEffect } from 'react';
import './EditProduct.css';
import upload_area from "../../../assets/upload_area.svg";
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: "",
        description: "",
        stock: 0,
    });

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://localhost:4000/allproducts`);
                const products = await response.json();
                const product = products.find(p => String(p.id) === id);
                if (product) {
                    setProductDetails(product);
                } else {
                    alert("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };
        fetchProductDetails();
    }, [id]);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const editProduct = async () => {
        let updatedProduct = { ...productDetails };

        if (image) {
            const formData = new FormData();
            formData.append('product', image);
            try {
                const uploadResponse = await fetch('http://localhost:4000/upload', {
                    method: 'POST',
                    body: formData,
                });
                const uploadData = await uploadResponse.json();
                if (uploadData.success) {
                    updatedProduct.image = uploadData.img_url;
                } else {
                    alert("Image upload failed");
                    return;
                }
            } catch (err) {
                console.error("Upload error:", err);
                alert("Image upload error");
                return;
            }
        }

        try {
            const response = await fetch(`http://localhost:4000/editproduct/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                const text = await response.text();
                console.error("Unexpected response:", text);
                alert("Unexpected response from the server");
                return;
            }

            const data = await response.json();
            if (data.success) {
                alert("Product updated successfully");
                navigate('/listproduct');
            } else {
                alert("Failed to update product: " + data.message);
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Server error while updating product");
        }
    };

    if (!productDetails.name) {
        return <p>Loading...</p>;
    }

    return (
        <div className='edit-product'>
            <div className="editproduct-itemfield">
                <p>Product Title</p>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type="text"
                    name="name"
                    placeholder="Type here"
                />
            </div>

            <div className="editproduct-price">
                <div className="editproduct-itemfield">
                    <p>Price</p>
                    <input
                        value={productDetails.old_price}
                        onChange={changeHandler}
                        type="number"
                        name="old_price"
                        placeholder="Old price"
                    />
                </div>
                <div className="editproduct-itemfield">
                    <p>Offer Price</p>
                    <input
                        value={productDetails.new_price}
                        onChange={changeHandler}
                        type="number"
                        name="new_price"
                        placeholder="Offer price"
                    />
                </div>
            </div>

            <div className="editproduct-itemfield">
                <p>Product Category</p>
                <select
                    value={productDetails.category}
                    onChange={changeHandler}
                    name="category"
                    className="edit-product-selector"
                >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>

            <div className="editproduct-itemfield">
                <p>Description</p>
                <textarea
                    value={productDetails.description}
                    onChange={changeHandler}
                    name="description"
                    placeholder="Product description"
                    className="edit-product-textarea"
                />
            </div>

            <div className="editproduct-itemfield">
                <p>Stock</p>
                <input
                    value={productDetails.stock}
                    onChange={changeHandler}
                    type="number"
                    name="stock"
                    min="0"
                    placeholder="Enter stock quantity"
                />
            </div>

            <div className="editproduct-itemfield">
                <label htmlFor="file-input">
                    <img
                        src={image ? URL.createObjectURL(image) : productDetails.image || upload_area}
                        className="editproduct-thumbnail-img"
                        alt="Product"
                    />
                </label>
                <input
                    onChange={imageHandler}
                    type="file"
                    name="image"
                    id="file-input"
                    hidden
                />
            </div>

            <button onClick={editProduct} className="editproduct-btn">EDIT</button>
        </div>
    );
};

export default EditProduct;