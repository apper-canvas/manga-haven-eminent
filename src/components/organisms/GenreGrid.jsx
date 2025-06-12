import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const GenreGrid = ({ genres = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Text as="h2" variant="h2" className="mb-4">
            EXPLORE BY GENRE
          </Text>
          <Text variant="lead">
            Find your preferred manga style
          </Text>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {genres.map((genre, index) => (
            <Button
              key={genre.name}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/browse?genre=${genre.name.toLowerCase()}`)}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center group"
              variant="ghost" // Use ghost variant to remove default button styles, then apply custom styles
              style={{ padding: '1.5rem' }} // Apply padding from button styles
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                <ApperIcon name={genre.icon} size={24} className="text-primary" />
              </div>
              <Text as="h3" variant="h4" className="font-semibold text-secondary mb-1">
                {genre.name}
              </Text>
              <Text variant="small" className="text-gray-500">
                {genre.count}
              </Text>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreGrid;