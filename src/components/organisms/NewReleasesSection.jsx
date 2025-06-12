import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProductCard from '@/components/molecules/ProductCard';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NewReleasesSection = ({ manga = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <Text as="h2" variant="h2" className="mb-2">
              NEW RELEASES
            </Text>
            <Text variant="lead">
              Latest additions to our collection
            </Text>
          </div>
          <Button
            onClick={() => navigate('/browse?sort=newest')}
            variant="ghost"
            className="hidden md:flex items-center space-x-2 text-primary hover:text-red-600 font-semibold"
          >
            <span>View All</span>
            <ApperIcon name="ArrowRight" size={16} />
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {manga.map((mangaItem, index) => (
            <motion.div
              key={mangaItem.id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard manga={mangaItem} compact />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button
            onClick={() => navigate('/browse?sort=newest')}
            variant="ghost"
            className="text-primary font-semibold"
          >
            View All New Releases
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewReleasesSection;