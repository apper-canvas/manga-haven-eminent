import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProductCard from '@/components/molecules/ProductCard';
import FilterSidebar from '@/components/organisms/FilterSidebar';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import { mangaService } from '@/services';

const BrowsePage = () => {
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
  const selectedAuthor = searchParams.get('author') || '';
  const selectedPublisher = searchParams.get('publisher') || '';
  const inStockFilter = searchParams.get('inStock') === 'true';
  const priceMaxFilter = searchParams.get('priceMax');
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

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.series.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(item =>
        item.genres.some(genre => 
          genre.toLowerCase() === selectedGenre.toLowerCase()
        )
      );
    }

    if (selectedAuthor) {
      filtered = filtered.filter(item =>
        item.author.toLowerCase() === selectedAuthor.toLowerCase()
      );
    }

    if (selectedPublisher) {
      filtered = filtered.filter(item =>
        item.publisher.toLowerCase() === selectedPublisher.toLowerCase()
      );
    }

    if (inStockFilter) {
      filtered = filtered.filter(item => item.inStock);
    }

    if (priceMaxFilter && parseInt(priceMaxFilter) < 50) {
      filtered = filtered.filter(item => item.price <= parseInt(priceMaxFilter));
    }

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
  }, [manga, searchQuery, selectedGenre, selectedAuthor, selectedPublisher, inStockFilter, priceMaxFilter, sortBy, sortParam]);

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
    return <LoadingSkeleton type="page" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error}>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            size="md"
            className="mt-4"
          >
            Try Again
          </Button>
        </ErrorMessage>
      </div>
    );
  }

  const hasActiveFilters = searchQuery || selectedGenre || selectedAuthor || selectedPublisher || inStockFilter || (priceMaxFilter && parseInt(priceMaxFilter) < 50);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Text as="h1" variant="h2" className="mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 
             selectedGenre ? `${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Manga` :
             'Browse All Manga'}
          </Text>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setSidebarOpen(true)}
                variant="ghost"
                className="md:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ApperIcon name="Filter" size={16} />
                <span>Filters</span>
              </Button>

              <Text variant="body" className="text-gray-600">
                Showing {filteredManga.length} of {manga.length} manga
              </Text>

              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-red-600 font-medium"
                >
                  Clear filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
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

              <div className="hidden sm:flex bg-white border border-gray-300 rounded-lg p-1">
                <Button
                  onClick={() => setViewMode('grid')}
                  variant="ghost"
                  className={`p-2 rounded ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={viewMode === 'grid' ? { backgroundColor: '#FF1744', color: 'white' } : {}}
                >
                  <ApperIcon name="Grid3X3" size={16} />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  variant="ghost"
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={viewMode === 'list' ? { backgroundColor: '#FF1744', color: 'white' } : {}}
                >
                  <ApperIcon name="List" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar
              manga={manga}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>

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
                      <Text as="h3" variant="h4">Filters</Text>
                      <Button
                        onClick={() => setSidebarOpen(false)}
                        variant="ghost"
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ApperIcon name="X" size={20} />
                      </Button>
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
                <Text as="h3" variant="h4" className="mt-4">No manga found</Text>
                <Text variant="body" className="mt-2 text-gray-500">
                  {searchQuery || selectedGenre
                    ? 'Try adjusting your search or filters'
                    : 'Check back later for new additions'
                  }
                </Text>
                {(searchQuery || selectedGenre) && (
                  <Button
                    onClick={clearFilters}
                    variant="primary"
                    size="md"
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
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
                      <ProductCard manga={item} listView={viewMode === 'list'} />
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

export default BrowsePage;