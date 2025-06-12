import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/molecules/ProductCard';
import Text from '@/components/atoms/Text';

const RelatedProductsSection = ({ relatedManga = [] }) => {
  if (relatedManga.length === 0) return null;

  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="mt-16"
    >
      <Text as="h2" variant="h3" className="mb-8">
        You Might Also Like
      </Text>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedManga.map((relatedItem, index) => (
          <motion.div
            key={relatedItem.id}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard manga={relatedItem} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default RelatedProductsSection;