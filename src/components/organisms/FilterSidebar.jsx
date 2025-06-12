import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const FilterSidebar = ({ manga = [], searchParams, setSearchParams, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState(searchParams.get('priceMax') ? [0, parseInt(searchParams.get('priceMax'))] : [0, 50]);
  const [isInStock, setIsInStock] = useState(searchParams.get('inStock') === 'true');

  // Sync internal state with URL params on initial load or URL change
  useEffect(() => {
    const priceMaxParam = searchParams.get('priceMax');
    setPriceRange(priceMaxParam ? [0, parseInt(priceMaxParam)] : [0, 50]);
    setIsInStock(searchParams.get('inStock') === 'true');
  }, [searchParams]);

  // Extract unique values from manga data
  const genres = [...new Set(manga.flatMap(item => item.genres))].sort();
  const authors = [...new Set(manga.map(item => item.author))].sort();
  const publishers = [...new Set(manga.map(item => item.publisher))].sort();

  const selectedGenre = searchParams.get('genre') || '';
  const selectedAuthor = searchParams.get('author') || '';
  const selectedPublisher = searchParams.get('publisher') || '';

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
    onFilterChange?.();
  };

  const handleGenreFilter = (genre) => {
    handleFilterChange('genre', selectedGenre === genre ? '' : genre);
  };

  const handleAuthorFilter = (author) => {
    handleFilterChange('author', selectedAuthor === author ? '' : author);
  };

  const handlePublisherFilter = (publisher) => {
    handleFilterChange('publisher', selectedPublisher === publisher ? '' : publisher);
  };

  const handleStockFilter = (checked) => {
    setIsInStock(checked);
    handleFilterChange('inStock', checked ? 'true' : '');
  };

  const handlePriceRangeChange = (e) => {
    const newMax = parseInt(e.target.value);
    setPriceRange([0, newMax]);
    handleFilterChange('priceMax', newMax === 50 ? '' : newMax.toString());
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceRange([0, 50]);
    setIsInStock(false);
    onFilterChange?.();
  };

  const hasActiveFilters = selectedGenre || selectedAuthor || selectedPublisher || isInStock || (searchParams.get('priceMax') && parseInt(searchParams.get('priceMax')) < 50);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <Text as="h3" variant="h4" className="font-display">Filters</Text>
        {hasActiveFilters && (
          <Button
            onClick={clearAllFilters}
            variant="ghost"
            size="sm"
            className="text-primary hover:text-red-600 font-medium"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Stock Filter */}
        <div>
          <Text as="h4" variant="h4" className="mb-3">Availability</Text>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isInStock}
              onChange={(e) => handleStockFilter(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <Text variant="body" className="text-sm">In Stock Only</Text>
          </label>
        </div>

        {/* Price Range */}
        <div>
          <Text as="h4" variant="h4" className="mb-3">Price Range</Text>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <Text variant="small">${priceRange[0]}</Text>
              <Text variant="small">${priceRange[1]}{priceRange[1] === 50 ? '+' : ''}</Text>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={priceRange[1]}
              onChange={handlePriceRangeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div>
            <Text as="h4" variant="h4" className="mb-3">Genres</Text>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  onClick={() => handleGenreFilter(genre)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedGenre === genre
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                  variant={selectedGenre === genre ? "primary" : "ghost"}
                  whileHover={selectedGenre === genre ? { scale: 1.02 } : { scale: 1.02, backgroundColor: '#f3f4f6' }}
                  whileTap={selectedGenre === genre ? { scale: 0.98 } : { scale: 0.98 }}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Authors */}
        {authors.length > 0 && (
          <div>
            <Text as="h4" variant="h4" className="mb-3">Authors</Text>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {authors.slice(0, 8).map((author) => (
                <Button
                  key={author}
                  onClick={() => handleAuthorFilter(author)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors break-words ${
                    selectedAuthor === author
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                  variant={selectedAuthor === author ? "primary" : "ghost"}
                  whileHover={selectedAuthor === author ? { scale: 1.02 } : { scale: 1.02, backgroundColor: '#f3f4f6' }}
                  whileTap={selectedAuthor === author ? { scale: 0.98 } : { scale: 0.98 }}
                >
                  {author}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Publishers */}
        {publishers.length > 0 && (
          <div>
            <Text as="h4" variant="h4" className="mb-3">Publishers</Text>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {publishers.slice(0, 6).map((publisher) => (
                <Button
                  key={publisher}
                  onClick={() => handlePublisherFilter(publisher)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors break-words ${
                    selectedPublisher === publisher
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                  variant={selectedPublisher === publisher ? "primary" : "ghost"}
                  whileHover={selectedPublisher === publisher ? { scale: 1.02 } : { scale: 1.02, backgroundColor: '#f3f4f6' }}
                  whileTap={selectedPublisher === publisher ? { scale: 0.98 } : { scale: 0.98 }}
                >
                  {publisher}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Series */}
        <div>
          <Text as="h4" variant="h4" className="mb-3">Popular Series</Text>
          <div className="space-y-2">
            {[...new Set(manga.map(item => item.series))]
              .slice(0, 5)
              .map((series) => (
                <Button
                  key={series}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('search', series);
                    setSearchParams(newParams);
                    onFilterChange?.();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors break-words"
                  variant="ghost"
                >
                  {series}
                </Button>
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