import React, { useContext, useState, useEffect } from 'react';
import "./ProductDisplay.css";
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    
    const [productData, setProductData] = useState(null);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchProductRating = async () => {
            try {
                const response = await fetch(`http://localhost:4000/productrating/${product.id}`);
                const data = await response.json();
                
                if (response.ok) {
                    setAverageRating(data.averageRating);
                } else {
                    console.error('Error fetching product rating:', data.message);
                }
            } catch (error) {
                console.error('Error fetching product rating:', error);
            }
        };

        if (product) {
            fetchProductRating();
            setProductData(product);
        }
    }, [product]);

    if (!productData) {
        return <p>Loading product...</p>;
    }

    const rating = Math.min(Math.max(Number(averageRating), 1), 5);

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={productData.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{productData.name}</h1>
                <div className="productdisplay-right-stars">
                    {[...Array(5)].map((_, index) => (
                        <img
                            key={index}
                            src={index < Math.floor(rating) ? star_icon : star_dull_icon}
                            alt="Star"
                        />
                    ))}
                </div>

                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">₹{productData.old_price}</div>
                    <div className="productdisplay-right-price-new">₹{productData.new_price}</div>
                </div>
                <div className="productdisplay-right-description">
                    {productData.description}
                </div>
                <button onClick={() => addToCart(productData.id)}>ADD TO CART</button>
                <p className='product-right-category'><span>Category:</span>{productData.category}</p>
            </div>
        </div>
    );
};

export default ProductDisplay;