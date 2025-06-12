import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FilterSidebar = ({ manga = [], searchParams, setSearchParams, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [isInStock, setIsInStock] = useState(false);

  // Extract unique values from manga data
  const genres = [...new Set(manga.flatMap(item => item.genres))].sort();
  const authors = [...new Set(manga.map(item => item.author))].sort();
  const publishers = [...new Set(manga.map(item => item.publisher))].sort();

  const selectedGenre = searchParams.get('genre') || '';
  const selectedAuthor = searchParams.get('author') || '';
  const selectedPublisher = searchParams.get('publisher') || '';

  const handleGenreFilter = (genre) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedGenre === genre) {
      newParams.delete('genre');
    } else {
      newParams.set('genre', genre);
    }
    setSearchParams(newParams);
    onFilterChange?.();
  };

  const handleAuthorFilter = (author) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedAuthor === author) {
      newParams.delete('author');
    } else {
      newParams.set('author', author);
    }
    setSearchParams(newParams);
    onFilterChange?.();
  };

  const handlePublisherFilter = (publisher) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedPublisher === publisher) {
      newParams.delete('publisher');
    } else {
      newParams.set('publisher', publisher);
    }
    setSearchParams(newParams);
    onFilterChange?.();
  };

  const handleStockFilter = (checked) => {
    setIsInStock(checked);
    const newParams = new URLSearchParams(searchParams);
    if (checked) {
      newParams.set('inStock', 'true');
    } else {
      newParams.delete('inStock');
    }
    setSearchParams(newParams);
    onFilterChange?.();
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceRange([0, 50]);
    setIsInStock(false);
    onFilterChange?.();
  };

  const hasActiveFilters = selectedGenre || selectedAuthor || selectedPublisher || isInStock;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-bold text-secondary">Filters</h3>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllFilters}
            className="text-primary hover:text-red-600 text-sm font-medium"
          >
            Clear All
          </motion.button>
        )}
      </div>

      <div className="space-y-6">
        {/* Stock Filter */}
        <div>
          <h4 className="font-semibold text-secondary mb-3">Availability</h4>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isInStock}
              onChange={(e) => handleStockFilter(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm">In Stock Only</span>
          </label>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-semibold text-secondary mb-3">Price Range</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}+</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div>
            <h4 className="font-semibold text-secondary mb-3">Genres</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {genres.map((genre) => (
                <motion.button
                  key={genre}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenreFilter(genre)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedGenre === genre
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {genre}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Authors */}
        {authors.length > 0 && (
          <div>
            <h4 className="font-semibold text-secondary mb-3">Authors</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {authors.slice(0, 8).map((author) => (
                <motion.button
                  key={author}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAuthorFilter(author)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors break-words ${
                    selectedAuthor === author
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {author}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Publishers */}
        {publishers.length > 0 && (
          <div>
            <h4 className="font-semibold text-secondary mb-3">Publishers</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {publishers.slice(0, 6).map((publisher) => (
                <motion.button
                  key={publisher}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePublisherFilter(publisher)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors break-words ${
                    selectedPublisher === publisher
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {publisher}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Series */}
        <div>
          <h4 className="font-semibold text-secondary mb-3">Popular Series</h4>
          <div className="space-y-2">
            {[...new Set(manga.map(item => item.series))]
              .slice(0, 5)
              .map((series) => (
                <motion.button
                  key={series}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('search', series);
                    setSearchParams(newParams);
                    onFilterChange?.();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors break-words"
                >
                  {series}
                </motion.button>
              ))
            }
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF1744;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF1744;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default FilterSidebar;