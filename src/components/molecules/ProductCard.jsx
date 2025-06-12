import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Image from '@/components/atoms/Image';
import Text from '@/components/atoms/Text';
import { cartService } from '@/services';

const ProductCard = ({ manga, compact = false, listView = false }) => {
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent navigating to detail page
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
          <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            <Image
              src={manga.coverImage}
              alt={manga.title}
              className="w-full h-full object-cover"
              fallbackText={`${manga.title} Cover`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0">
                <Text as="h3" variant="h4" className="font-semibold text-secondary break-words line-clamp-1">
                  {manga.title}
                </Text>
                <Text variant="small" className="text-gray-600">
                  Vol. {manga.volume} • {manga.author}
                </Text>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <Text className="font-bold text-primary">${manga.price.toFixed(2)}</Text>
                <Text variant="caption" className={`${manga.inStock ? 'text-success' : 'text-gray-400'}`}>
                  {manga.inStock ? 'In Stock' : 'Out of Stock'}
                </Text>
              </div>
            </div>

            <div className="flex items-center justify-between">
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

              {manga.inStock && (
                <Button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  size="sm"
                  variant="primary"
                  className="space-x-1"
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
                </Button>
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
      <div className={`relative bg-gray-100 ${compact ? 'aspect-[3/4]' : 'aspect-[3/4]'}`}>
        <Image
          src={manga.coverImage}
          alt={manga.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fallbackText={`${manga.title} Cover`}
        />
        
        <div className="absolute top-2 right-2 bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg volume-badge">
          #{manga.volume}
        </div>

        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            manga.inStock 
              ? 'bg-success text-white' 
              : 'bg-gray-400 text-white'
          }`}>
            {manga.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {manga.inStock && (
          <Button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={addingToCart}
            variant="ghost" // Use ghost variant to override default Button styling for this specific component
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
          </Button>
        )}
      </div>

      <div className={`p-4 ${compact ? 'p-3' : 'p-4'}`}>
        <Text as="h3" variant="h4" className={`font-semibold text-secondary mb-1 line-clamp-2 ${
          compact ? 'text-sm' : 'text-base'
        }`}>
          {manga.title}
        </Text>
        
        <Text variant="small" className={`text-gray-600 mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>
          {manga.author}
        </Text>

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
          <Text className="font-bold text-primary text-lg">
            ${manga.price.toFixed(2)}
          </Text>
          
          {compact && (
            <Text variant="caption" className="text-gray-500">
              Vol. {manga.volume}
            </Text>
          )}
        </div>

        {manga.inStock && !compact && (
          <Button
            onClick={handleAddToCart}
            disabled={addingToCart}
            variant="primary"
            className="w-full mt-3 space-x-2 md:hidden"
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
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;