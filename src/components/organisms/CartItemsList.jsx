import React from 'react';
import { AnimatePresence } from 'framer-motion';
import CartItem from '@/components/molecules/CartItem';

const CartItemsList = ({ cartDetails, updateQuantity, removeItem, updating }) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      <AnimatePresence>
        {cartDetails.map((item) => (
          <CartItem
            key={item.mangaId}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            isUpdating={updating[item.mangaId]}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CartItemsList;