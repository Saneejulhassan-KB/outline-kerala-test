"use client";
import React, { useState, useEffect } from "react";
import "./advertisement-popup.css";

const AdvertisementPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup on mount (every refresh)
    // Use a small timeout to allow for smooth entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible && typeof window !== 'undefined' && !document.querySelector('.ad-popup-overlay.show')) {
      // Return null if not visible to avoid rendering empty DOM elements, 
      // but keep the component mounted if we want to support re-opening logic later.
      // For now, we rely on CSS opacity/visibility for the transition out, 
      // so we render the structure but with 'show' class toggled.
  }

  return (
    <div className={`ad-popup-overlay ${isVisible ? "show" : ""}`}>
      <div className="ad-popup-content">
        <button className="ad-popup-close" onClick={handleClose} aria-label="Close Ad">
          <i className="fa fa-times" aria-hidden="true"></i>
        </button>
        
        <div className="ad-popup-image-container">
          {/* Replace with your actual ad image source */}
          <img 
            src="https://matrixmarketinggroup.com/wp-content/uploads/2021/12/Mcdonalds-Food-Ad.jpg" 
            alt="Special Offer" 
            className="ad-popup-image"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://placehold.co/600x400?text=Advertisement";
            }}
          />
        </div>
        
        {/* <div className="ad-popup-footer">
          <h3 className="ad-popup-title">Limited Time Offer!</h3>
          <p className="ad-popup-description">
            Grab this exclusive deal before it's gone. Visit our store or order online today.
          </p>
          <a href="#" className="ad-popup-btn">
            Order Now <i className="fa fa-arrow-right ms-2"></i>
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default AdvertisementPopup;
