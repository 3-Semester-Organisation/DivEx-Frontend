import React, { useState } from "react";

const Image = ({ src, alt, width=200, height=200, placeholder=false, className, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        width: width || "auto",
        height: height || "auto",
        overflow: "hidden",
        position: "relative",
      }}
      className={className}
    >
      {/* Placeholder */}
      {!loaded && placeholder && (
        <img
          src={placeholder}
          alt="placeholder"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(10px)",
          }}
        />
      )}
      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          width: "100%",
          height: "100%",
          objectFit: "scale-down",
        }}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </div>
  );
};

export default Image;