import React from 'react'
import "./DescriptionBox.css"

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews(122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>This website was created to make fashion shopping easy, accessible, and convenient for everyone.It connects
               buyers and sellers digitally, allowing sellers to showcase their products without a physical store. Customers 
               can browse collections, make secure payments, and enjoy fast delivery with easy returns. Sellers interact with 
               buyers through chat support, reviews, and AI-driven recommendations.With a growing customer base and a vast 
               collection of trendy apparel, this website is redefining online fashion shopping!
               </p>
               <p>
               This website offers a wide range of clothing with multiple sizes, colors, and competitive prices. Each 
               product comes with high-quality images and a detailed description for a better shopping experience.
               Easily browse, select, and add your favorite styles to the cart with just a click!
               </p>
        </div>
    </div>
  )
}

export default DescriptionBox