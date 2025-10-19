import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = '#007AFF', 
  text = 'Loading...',
  showText = true 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xlarge: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin`}
        style={{
          borderTopColor: color,
          borderRightColor: color
        }}
      />
      {showText && (
        <p
          className={`${textSizes[size]} text-gray-600 animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
