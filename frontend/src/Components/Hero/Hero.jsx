import React from 'react'
import "./Hero.css"
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from  '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {

    const scrollToNewCollections = () => {
        const section = document.getElementById("new-collections-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      };

  return (
    <div className='hero'>
        <div className="hero-left">
            <h2>NEW ARRIVALS ONLY</h2>
            <div>
                <div className="hero-hand-icon">
                    <p>Recent</p>
                    <img src={hand_icon} alt="" />
                </div>
                <p>collection</p>
                <p>for everyone</p>
            </div>
            <div className="hero-latest-button">
                <div>Latest collection</div>
                <img onClick={scrollToNewCollections} src={arrow_icon} alt="" />
            </div>
        </div>
        <div className="hero-right">
            <img src={hero_image} alt="" />
        </div>
    </div>
  )
}

export default Hero