"use client";
import React, { useState, useEffect } from "react";
import "./advertisement-popup.css";

const AD_IMAGES = [
  {
    src: "./adds/add1.jpeg",
    alt: "McDonalds Special Offer",
    link: "#"
  },
  {
    src: "./adds/add2.jpeg",
    alt: "Burger King Deal",
    link: "#"
  },
  {
    src: "./adds/add3.jpeg",
    alt: "Pizza Hut Promotion",
    link: "#"
  }
];

const AdvertisementPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAd, setCurrentAd] = useState(AD_IMAGES[0]);

  useEffect(() => {
    // Logic to rotate images
    const lastIndex = parseInt(localStorage.getItem("lastAdIndex") || "-1", 10);
    const nextIndex = (lastIndex + 1) % AD_IMAGES.length;
    
    setCurrentAd(AD_IMAGES[nextIndex]);
    localStorage.setItem("lastAdIndex", nextIndex.toString());

    // Show popup on mount (every refresh)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible && typeof window !== 'undefined' && !document.querySelector('.ad-popup-overlay.show')) {
      // Keep component mounted for transition logic
  }

  return (
    <div className={`ad-popup-overlay ${isVisible ? "show" : ""}`}>
      <div className="ad-popup-content">
        <button className="ad-popup-close" onClick={handleClose} aria-label="Close Ad">
          <i className="fa fa-times" aria-hidden="true"></i>
        </button>
        
        <div className="ad-popup-image-container">
          <a href={currentAd.link} target="_blank" rel="noopener noreferrer" className="d-block w-100">
            <img 
              src={currentAd.src} 
              alt={currentAd.alt} 
              className="ad-popup-image"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/600x400?text=Advertisement";
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementPopup;
