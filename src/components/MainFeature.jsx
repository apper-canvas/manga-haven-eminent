import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';
import MangaCard from './MangaCard';
import { mangaService } from '../services';

const MainFeature = () => {
  const navigate = useNavigate();
  const [featuredManga, setFeaturedManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadFeaturedManga = async () => {
      try {
        const allManga = await mangaService.getAll();
        // Get random featured manga
        const shuffled = [...allManga].sort(() => 0.5 - Math.random());
        setFeaturedManga(shuffled.slice(0, 8));
      } catch (error) {
        console.error('Failed to load featured manga:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedManga();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const popularGenres = [
    { name: 'Shonen', icon: 'Zap', color: 'bg-blue-500' },
    { name: 'Seinen', icon: 'Target', color: 'bg-red-500' },
    { name: 'Shojo', icon: 'Heart', color: 'bg-pink-500' },
    { name: 'Action', icon: 'Sword', color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Search Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold text-secondary mb-6">
          FIND YOUR NEXT MANGA
        </h2>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or series..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <ApperIcon name="Search" size={20} />
              <span className="hidden sm:inline">Search</span>
            </motion.button>
          </div>
        </form>

        {/* Quick Genre Access */}
        <div className="flex flex-wrap justify-center gap-3">
          {popularGenres.map((genre, index) => (
            <motion.button
              key={genre.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/browse?genre=${genre.name.toLowerCase()}`)}
              className={`${genre.color} text-white px-4 py-2 rounded-full font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity`}
            >
              <ApperIcon name={genre.icon} size={16} />
              <span>{genre.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Featured Manga Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-display text-xl font-bold text-secondary">
            FEATURED MANGA
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/browse')}
            className="text-primary hover:text-red-600 font-semibold flex items-center space-x-1"
          >
            <span>View All</span>
            <ApperIcon name="ArrowRight" size={16} />
          </motion.button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="shimmer h-80 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredManga.map((manga, index) => (
              <motion.div
                key={manga.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MangaCard manga={manga} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Quick Stats */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-primary/5 to-accent/5 p-8 rounded-lg"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-primary mb-1">10,000+</div>
            <div className="text-gray-600">Manga Volumes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">500+</div>
            <div className="text-gray-600">Series Available</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">25+</div>
            <div className="text-gray-600">Genres</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">Fast</div>
            <div className="text-gray-600">Shipping</div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center bg-secondary text-white p-12 rounded-lg"
      >
        <h3 className="font-display text-2xl font-bold mb-4">
          START YOUR COLLECTION TODAY
        </h3>
        <p className="text-gray-300 mb-6 max-w-md mx-auto">
          Discover amazing manga series and build your personal library with our extensive collection.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/browse')}
          className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
        >
          <ApperIcon name="ShoppingBag" size={20} />
          <span>Shop Now</span>
        </motion.button>
      </motion.section>
    </div>
  );
};

export default MainFeature;