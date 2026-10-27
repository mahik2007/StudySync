import React from 'react';

export default function Logo({ className = "w-8 h-8", alt = "StudySync Logo" }) {
  return (
    <img
      src="/favicon.svg"
      alt={alt}
      className={`inline-block object-contain select-none shrink-0 ${className}`}
    />
  );
}
