import React from 'react';

const LoadingOverlay = ({ message = 'Loading data...' }) => {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-surface-200 rounded w-64 mb-4"></div>
        <div className="h-12 bg-surface-200 rounded mb-6"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;