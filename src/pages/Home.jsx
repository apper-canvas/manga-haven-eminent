import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import MangaCard from '../components/MangaCard';
import { mangaService } from '../services';

const Home = () => {
  const navigate = useNavigate();
  const [featuredManga, setFeaturedManga] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allManga = await mangaService.getAll();
        
        // Get featured manga (first 4)
        setFeaturedManga(allManga.slice(0, 4));
        
        // Get new releases (sorted by release date, take 6)
        const sorted = [...allManga].sort((a, b) => 
          new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setNewReleases(sorted.slice(0, 6));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const genres = [
    { name: 'Shonen', icon: 'Zap', count: '150+' },
    { name: 'Seinen', icon: 'Target', count: '120+' },
    { name: 'Shojo', icon: 'Heart', count: '80+' },
    { name: 'Josei', icon: 'Flower', count: '60+' },
    { name: 'Action', icon: 'Sword', count: '200+' },
    { name: 'Romance', icon: 'HeartHandshake', count: '90+' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Skeleton */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 h-96">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="shimmer h-12 w-3/4 mb-4 rounded"></div>
            <div className="shimmer h-6 w-1/2 mb-8 rounded"></div>
            <div className="shimmer h-12 w-40 rounded"></div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="shimmer h-8 w-48 mb-8 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shimmer h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold text-secondary mb-4">
              DISCOVER YOUR NEXT
              <span className="text-primary block">MANGA ADVENTURE</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore thousands of manga volumes from classic series to the latest releases. 
              Your manga collection starts here.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/browse')}
              className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
            >
              <span>Start Browsing</span>
              <ApperIcon name="ArrowRight" size={20} />
            </motion.button>
          </motion.div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 gap-2 h-full">
            {[...Array(64)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.01, duration: 0.5 }}
                className="bg-secondary rounded"
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Manga */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
              FEATURED MANGA
            </h2>
            <p className="text-gray-600 text-lg">
              Handpicked favorites from our collection
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredManga.map((manga, index) => (
              <motion.div
                key={manga.id}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <MangaCard manga={manga} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/browse')}
              className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              View All Manga
            </motion.button>
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
              EXPLORE BY GENRE
            </h2>
            <p className="text-gray-600 text-lg">
              Find your preferred manga style
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {genres.map((genre, index) => (
              <motion.button
                key={genre.name}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/browse?genre=${genre.name.toLowerCase()}`)}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <ApperIcon name={genre.icon} size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-secondary mb-1">{genre.name}</h3>
                <p className="text-sm text-gray-500">{genre.count}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* New Releases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
                NEW RELEASES
              </h2>
              <p className="text-gray-600 text-lg">
                Latest additions to our collection
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/browse?sort=newest')}
              className="hidden md:flex items-center space-x-2 text-primary hover:text-red-600 font-semibold"
            >
              <span>View All</span>
              <ApperIcon name="ArrowRight" size={16} />
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {newReleases.map((manga, index) => (
              <motion.div
                key={manga.id}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <MangaCard manga={manga} compact />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/browse?sort=newest')}
              className="text-primary font-semibold"
            >
              View All New Releases
            </motion.button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              JOIN THE MANGA HAVEN COMMUNITY
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Over 10,000 manga volumes available with fast shipping and secure packaging
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/browse')}
                className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Start Shopping
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/browse?sort=newest')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-secondary transition-colors"
              >
                Browse New Releases
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;