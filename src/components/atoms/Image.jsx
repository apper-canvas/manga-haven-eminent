import React from 'react';

const Image = ({ src, alt, className = '', fallbackText = '', ...props }) => {
  const handleImageError = (e) => {
    // Generate a placeholder image URL if fallbackText is provided
    const encodedText = encodeURIComponent(fallbackText || alt || 'Image');
    e.target.src = `https://via.placeholder.com/300x400/f0f0f0/666?text=${encodedText}`;
    e.target.style.objectFit = 'contain'; // Ensure text is visible
    e.target.style.backgroundColor = '#f0f0f0';
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleImageError}
      {...props}
    />
  );
};

export default Image;