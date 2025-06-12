import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import MangaCard from '../components/MangaCard';
import FilterSidebar from '../components/FilterSidebar';
import { mangaService } from '../services';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [manga, setManga] = useState([]);
  const [filteredManga, setFilteredManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [viewMode, setViewMode] = useState('grid');

  const searchQuery = searchParams.get('search') || '';
  const selectedGenre = searchParams.get('genre') || '';
  const sortParam = searchParams.get('sort') || '';

  useEffect(() => {
    const loadManga = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await mangaService.getAll();
        setManga(data);
      } catch (err) {
        setError(err.message || 'Failed to load manga');
      } finally {
        setLoading(false);
      }
    };

    loadManga();
  }, []);

  useEffect(() => {
    let filtered = [...manga];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.series.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter(item =>
        item.genres.some(genre => 
          genre.toLowerCase() === selectedGenre.toLowerCase()
        )
      );
    }

    // Apply sorting
    const currentSort = sortParam || sortBy;
    filtered.sort((a, b) => {
      switch (currentSort) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredManga(filtered);
  }, [manga, searchQuery, selectedGenre, sortBy, sortParam]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    const newParams = new URLSearchParams(searchParams);
    if (newSort !== 'title') {
      newParams.set('sort', newSort);
    } else {
      newParams.delete('sort');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSortBy('title');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="shimmer h-8 w-48 mb-4 rounded"></div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="shimmer h-10 w-64 rounded"></div>
              <div className="shimmer h-10 w-32 rounded"></div>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="shimmer h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Manga</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-2xl md:text-3xl font-bold text-secondary mb-4"
          >
            {searchQuery ? `Search Results for "${searchQuery}"` : 
             selectedGenre ? `${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Manga` :
             'Browse All Manga'}
          </motion.h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Filters & Search Info */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                className="md:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ApperIcon name="Filter" size={16} />
                <span>Filters</span>
              </motion.button>

              <p className="text-gray-600">
                Showing {filteredManga.length} of {manga.length} manga
              </p>

              {(searchQuery || selectedGenre) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="text-primary hover:text-red-600 text-sm font-medium"
                >
                  Clear filters
                </motion.button>
              )}
            </div>

            {/* Sort & View Options */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortParam || sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  } transition-colors`}
                >
                  <ApperIcon name="Grid3X3" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  } transition-colors`}
                >
                  <ApperIcon name="List" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar
              manga={manga}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto md:hidden"
                >
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Filters</h3>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ApperIcon name="X" size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <FilterSidebar
                      manga={manga}
                      searchParams={searchParams}
                      setSearchParams={setSearchParams}
                      onFilterChange={() => setSidebarOpen(false)}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {filteredManga.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <ApperIcon name="BookOpen" size={64} className="text-gray-300 mx-auto" />
                </motion.div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No manga found</h3>
                <p className="mt-2 text-gray-500">
                  {searchQuery || selectedGenre
                    ? 'Try adjusting your search or filters'
                    : 'Check back later for new additions'
                  }
                </p>
                {(searchQuery || selectedGenre) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Clear Filters
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                layout
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                    : 'space-y-4'
                }
              >
                <AnimatePresence>
                  {filteredManga.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MangaCard manga={item} listView={viewMode === 'list'} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;