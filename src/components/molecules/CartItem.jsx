import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Image from '@/components/atoms/Image';
import Text from '@/components/atoms/Text';
import QuantitySelector from '@/components/molecules/QuantitySelector';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem, isUpdating }) => {
  return (
    <motion.div
      key={item.mangaId}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        <div 
          className="w-16 h-20 bg-gray-100 rounded cursor-pointer overflow-hidden flex-shrink-0"
          onClick={() => window.location.href = `/manga/${item.manga.id}`} // Using direct navigation to avoid prop drilling useNavigate
        >
          <Image
            src={item.manga.coverImage}
            alt={item.manga.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            fallbackText={`${item.manga.title} Cover`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <Text 
                as="h3" 
                variant="h4" 
                className="font-semibold text-secondary hover:text-primary cursor-pointer break-words"
                onClick={() => window.location.href = `/manga/${item.manga.id}`} // Using direct navigation
              >
                {item.manga.title}
              </Text>
              <Text variant="small" className="text-gray-600">
                Vol. {item.manga.volume} • {item.manga.author}
              </Text>
            </div>
            <Button
              onClick={() => onRemoveItem(item.mangaId)}
              disabled={isUpdating}
              variant="ghost"
              size="sm"
              className="p-1"
            >
              {isUpdating ? (
                <LoadingSpinner size={16} />
              ) : (
                <ApperIcon name="Trash2" size={16} />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <QuantitySelector
              quantity={item.quantity}
              onQuantityChange={(newQty) => onUpdateQuantity(item.mangaId, newQty)}
              disabled={isUpdating}
            />

            <div className="text-right">
              <Text className="font-semibold text-primary">
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
              <Text variant="small" className="text-gray-500">
                ${item.price.toFixed(2)} each
              </Text>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;