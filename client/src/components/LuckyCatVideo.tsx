import React from 'react';

export default function LuckyCatVideo() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        className="w-full h-full object-contain"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/LuckyCat.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
} 