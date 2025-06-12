import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { mangaService, cartService } from '../services';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedManga, setRelatedManga] = useState([]);

  useEffect(() => {
    const loadManga = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await mangaService.getById(id);
        if (!data) {
          throw new Error('Manga not found');
        }
        setManga(data);

        // Load related manga (same series or similar genres)
        const allManga = await mangaService.getAll();
        const related = allManga
          .filter(item => 
            item.id !== id && (
              item.series === data.series ||
              item.genres.some(genre => data.genres.includes(genre))
            )
          )
          .slice(0, 4);
        setRelatedManga(related);
      } catch (err) {
        setError(err.message || 'Failed to load manga details');
      } finally {
        setLoading(false);
      }
    };

    loadManga();
  }, [id]);

  const handleAddToCart = async () => {
    if (!manga) return;

    setAddingToCart(true);
    try {
      const cartItem = {
        mangaId: manga.id,
        quantity: quantity,
        price: manga.price
      };

      await cartService.create(cartItem);
      toast.success(`Added ${manga.title} to cart!`);
      
      // Optional: redirect to cart or show success animation
      setTimeout(() => {
        navigate('/cart');
      }, 1000);
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Add to cart error:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image skeleton */}
            <div className="shimmer h-96 lg:h-[600px] rounded-lg"></div>
            
            {/* Details skeleton */}
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Manga Not Found</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/browse')}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Browse
          </motion.button>
        </div>
      </div>
    );
  }

  if (!manga) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center space-x-2 text-sm text-gray-500 mb-8"
        >
          <button onClick={() => navigate('/browse')} className="hover:text-primary">
            Browse
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-gray-900">{manga.title}</span>
        </motion.nav>

        {/* Main Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={manga.coverImage}
                alt={manga.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x400/f0f0f0/666?text=${encodeURIComponent(manga.title)}`;
                }}
              />
            </div>
            
            {/* Volume Badge */}
            <div className="absolute top-4 right-4 bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
              #{manga.volume}
            </div>

            {/* Stock Status */}
            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                manga.inStock 
                  ? 'bg-success text-white' 
                  : 'bg-gray-400 text-white'
              }`}>
                {manga.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            {/* Title and Series */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
                {manga.title}
              </h1>
              <p className="text-lg text-gray-600">
                Series: <span className="font-medium">{manga.series}</span>
              </p>
            </div>

            {/* Author and Publisher */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-500">Author:</span>
                <span className="ml-1 font-medium">{manga.author}</span>
              </div>
              <div>
                <span className="text-gray-500">Publisher:</span>
                <span className="ml-1 font-medium">{manga.publisher}</span>
              </div>
              <div>
                <span className="text-gray-500">Release Date:</span>
                <span className="ml-1 font-medium">
                  {new Date(manga.releaseDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {manga.genres.map((genre) => (
                  <motion.button
                    key={genre}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/browse?genre=${genre.toLowerCase()}`)}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                  >
                    {genre}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-3">Synopsis</h3>
              <p className="text-gray-700 leading-relaxed">{manga.synopsis}</p>
            </div>

            {/* Price and Purchase */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-primary">
                  ${manga.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  Volume {manga.volume}
                </div>
              </div>

              {manga.inStock ? (
                <div className="space-y-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4">
                    <label htmlFor="quantity" className="font-medium">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <ApperIcon name="Minus" size={16} />
                      </button>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center py-2 border-0 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <ApperIcon name="Plus" size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {addingToCart ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <ApperIcon name="Loader2" size={20} />
                        </motion.div>
                        <span>Adding to Cart...</span>
                      </>
                    ) : (
                      <>
                        <ApperIcon name="ShoppingCart" size={20} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </motion.button>

                  {/* Total Price */}
                  <div className="text-center text-gray-600">
                    Total: <span className="font-semibold text-secondary">
                      ${(manga.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">Currently out of stock</p>
                  <button className="w-full bg-gray-300 text-gray-500 py-4 rounded-lg font-semibold text-lg cursor-not-allowed">
                    Notify When Available
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Related Manga */}
        {relatedManga.length > 0 && (
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-secondary mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedManga.map((relatedItem, index) => (
                <motion.div
                  key={relatedItem.id}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/manga/${relatedItem.id}`)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                >
                  <div className="aspect-[3/4] bg-gray-100">
                    <img
                      src={relatedItem.coverImage}
                      alt={relatedItem.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/200x267/f0f0f0/666?text=${encodeURIComponent(relatedItem.title)}`;
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {relatedItem.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">Vol. {relatedItem.volume}</p>
                    <p className="text-primary font-bold">${relatedItem.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;