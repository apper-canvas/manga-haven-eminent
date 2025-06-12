import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const CallToActionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-secondary text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <Text as="h2" variant="h2" className="text-white mb-4">
            JOIN THE MANGA HAVEN COMMUNITY
          </Text>
          <Text variant="lead" className="text-gray-300 mb-8 max-w-md mx-auto">
            Over 10,000 manga volumes available with fast shipping and secure packaging
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/browse')}
              variant="primary"
              size="lg"
            >
              Start Shopping
            </Button>
            <Button
              onClick={() => navigate('/browse?sort=newest')}
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-secondary"
            >
              Browse New Releases
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;