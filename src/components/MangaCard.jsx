import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { cartService } from '../services';

const MangaCard = ({ manga, compact = false, listView = false }) => {
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setAddingToCart(true);
    
    try {
      const cartItem = {
        mangaId: manga.id,
        quantity: 1,
        price: manga.price
      };

      await cartService.create(cartItem);
      toast.success(`Added ${manga.title} to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Add to cart error:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (listView) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
        onClick={() => navigate(`/manga/${manga.id}`)}
      >
        <div className="flex gap-4 p-4">
          {/* Cover Image */}
          <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            <img
              src={manga.coverImage}
              alt={manga.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/64x80/f0f0f0/666?text=${encodeURIComponent(manga.title)}`;
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-secondary break-words line-clamp-1">
                  {manga.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Vol. {manga.volume} • {manga.author}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="font-bold text-primary">${manga.price.toFixed(2)}</div>
                <div className={`text-xs ${manga.inStock ? 'text-success' : 'text-gray-400'}`}>
                  {manga.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Genres */}
              <div className="flex flex-wrap gap-1">
                {manga.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Add to Cart Button */}
              {manga.inStock && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-1"
                >
                  {addingToCart ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ApperIcon name="Loader2" size={12} />
                    </motion.div>
                  ) : (
                    <>
                      <ApperIcon name="Plus" size={12} />
                      <span>Add</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className="manga-card bg-white rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
      onClick={() => navigate(`/manga/${manga.id}`)}
    >
      {/* Cover Image */}
      <div className={`relative bg-gray-100 ${compact ? 'aspect-[3/4]' : 'aspect-[3/4]'}`}>
        <img
          src={manga.coverImage}
          alt={manga.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/300x400/f0f0f0/666?text=${encodeURIComponent(manga.title)}`;
          }}
        />
        
        {/* Volume Badge */}
        <div className="absolute top-2 right-2 bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg volume-badge">
          #{manga.volume}
        </div>

        {/* Stock Status */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            manga.inStock 
              ? 'bg-success text-white' 
              : 'bg-gray-400 text-white'
          }`}>
            {manga.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Quick Add Button - Only show on hover for desktop */}
        {manga.inStock && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-primary p-2 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
          >
            {addingToCart ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ApperIcon name="Loader2" size={16} />
              </motion.div>
            ) : (
              <ApperIcon name="ShoppingCart" size={16} />
            )}
          </motion.button>
        )}
      </div>

      {/* Card Content */}
      <div className={`p-4 ${compact ? 'p-3' : 'p-4'}`}>
        <h3 className={`font-semibold text-secondary mb-1 line-clamp-2 ${
          compact ? 'text-sm' : 'text-base'
        }`}>
          {manga.title}
        </h3>
        
        <p className={`text-gray-600 mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>
          {manga.author}
        </p>

        {!compact && (
          <div className="flex flex-wrap gap-1 mb-3">
            {manga.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="font-bold text-primary text-lg">
            ${manga.price.toFixed(2)}
          </div>
          
          {compact && (
            <div className="text-xs text-gray-500">
              Vol. {manga.volume}
            </div>
          )}
        </div>

        {/* Mobile Add to Cart Button */}
        {manga.inStock && !compact && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="w-full mt-3 bg-primary text-white py-2 rounded font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 md:hidden"
          >
            {addingToCart ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ApperIcon name="Loader2" size={16} />
                </motion.div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <ApperIcon name="ShoppingCart" size={16} />
                <span>Add to Cart</span>
              </>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default MangaCard;