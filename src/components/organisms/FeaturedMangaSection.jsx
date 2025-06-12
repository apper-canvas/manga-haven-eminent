import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '@/components/molecules/ProductCard';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const FeaturedMangaSection = ({ manga = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Text as="h2" variant="h2" className="mb-4">
            FEATURED MANGA
          </Text>
          <Text variant="lead">
            Handpicked favorites from our collection
          </Text>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {manga.map((mangaItem, index) => (
            <motion.div
              key={mangaItem.id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard manga={mangaItem} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/browse')}
            variant="outline"
            size="md"
          >
            View All Manga
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMangaSection;