import React from 'react';

const LoadingSkeleton = ({ type = 'page', count = 3 }) => {
  if (type === 'page') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="shimmer h-8 w-48 mb-4 rounded"></div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="shimmer h-10 w-64 rounded"></div>
              <div className="shimmer h-10 w-32 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(count * 5)].map((_, i) => (
              <div key={i} className="shimmer h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'cart') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="shimmer h-8 w-32 mb-8 rounded"></div>
          <div className="space-y-6">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex gap-4">
                  <div className="shimmer w-16 h-20 rounded"></div>
                  <div className="flex-1 space-y-3">
                    <div className="shimmer h-4 w-3/4 rounded"></div>
                    <div className="shimmer h-4 w-1/2 rounded"></div>
                    <div className="shimmer h-8 w-32 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'productDetail') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="shimmer h-96 lg:h-[600px] rounded-lg"></div>
            <div className="space-y-6">
              <div className="shimmer h-8 w-3/4 rounded"></div>
              <div className="shimmer h-6 w-1/2 rounded"></div>
              <div className="shimmer h-16 w-full rounded"></div>
              <div className="shimmer h-32 w-full rounded"></div>
              <div className="shimmer h-12 w-40 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'checkout') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="shimmer h-8 w-32 mb-8 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="shimmer h-64 rounded-lg"></div>
              <div className="shimmer h-64 rounded-lg"></div>
            </div>
            <div className="shimmer h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'homeHero') {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 h-96">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="shimmer h-12 w-3/4 mb-4 rounded"></div>
          <div className="shimmer h-6 w-1/2 mb-8 rounded"></div>
          <div className="shimmer h-12 w-40 rounded"></div>
        </div>
      </div>
    );
  }

  if (type === 'cardGrid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="shimmer h-80 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return <div className="shimmer h-20 w-full rounded"></div>; // Default generic skeleton
};

export default LoadingSkeleton;