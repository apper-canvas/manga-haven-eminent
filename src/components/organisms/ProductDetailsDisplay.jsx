import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Image from '@/components/atoms/Image';
import Text from '@/components/atoms/Text';
import QuantitySelector from '@/components/molecules/QuantitySelector';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { cartService } from '@/services';

const ProductDetailsDisplay = ({ manga }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="relative"
      >
        <div className="aspect-[3/4] bg-white rounded-lg shadow-lg overflow-hidden">
          <Image
            src={manga.coverImage}
            alt={manga.title}
            className="w-full h-full object-cover"
            fallbackText={`${manga.title} Cover`}
          />
        </div>
        
        <div className="absolute top-4 right-4 bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
          #{manga.volume}
        </div>

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

      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <Text as="h1" variant="h2" className="mb-2">
            {manga.title}
          </Text>
          <Text variant="lead" className="text-gray-600">
            Series: <span className="font-medium">{manga.series}</span>
          </Text>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <Text variant="small">Author:</Text>
            <Text variant="body" className="ml-1 font-medium">{manga.author}</Text>
          </div>
          <div>
            <Text variant="small">Publisher:</Text>
            <Text variant="body" className="ml-1 font-medium">{manga.publisher}</Text>
          </div>
          <div>
            <Text variant="small">Release Date:</Text>
            <Text variant="body" className="ml-1 font-medium">
              {new Date(manga.releaseDate).toLocaleDateString()}
            </Text>
          </div>
        </div>

        <div>
          <Text as="h3" variant="h4" className="text-sm font-medium text-gray-500 mb-2">Genres</Text>
          <div className="flex flex-wrap gap-2">
            {manga.genres.map((genre) => (
              <Button
                key={genre}
                onClick={() => navigate(`/browse?genre=${genre.toLowerCase()}`)}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                variant="ghost" // Override button base style
                style={{ backgroundColor: 'rgb(255 23 68 / 0.1)', color: '#FF1744' }}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Text as="h3" variant="h4" className="mb-3">Synopsis</Text>
          <Text variant="body" className="leading-relaxed">{manga.synopsis}</Text>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <Text variant="h3" className="text-3xl text-primary">
              ${manga.price.toFixed(2)}
            </Text>
            <Text variant="small" className="text-gray-500">
              Volume {manga.volume}
            </Text>
          </div>

          {manga.inStock ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Text variant="body" as="label" htmlFor="quantity" className="font-medium">Quantity:</Text>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                variant="primary"
                size="lg"
                className="w-full space-x-2"
              >
                {addingToCart ? (
                  <>
                    <LoadingSpinner size={20} />
                    <span>Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="ShoppingCart" size={20} />
                    <span>Add to Cart</span>
                  </>
                )}
              </Button>

              <Text variant="body" className="text-center text-gray-600">
                Total: <span className="font-semibold text-secondary">
                  ${(manga.price * quantity).toFixed(2)}
                </span>
              </Text>
            </div>
          ) : (
            <div className="text-center py-4">
              <Text variant="body" className="text-gray-500 mb-4">Currently out of stock</Text>
              <Button disabled variant="disabled" size="lg" className="w-full">
                Notify When Available
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetailsDisplay;