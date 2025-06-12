import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Text as="h1" variant="h1" className="mb-4">
            DISCOVER YOUR NEXT
            <span className="text-primary block">MANGA ADVENTURE</span>
          </Text>
          <Text variant="lead" className="mb-8 max-w-2xl mx-auto">
            Explore thousands of manga volumes from classic series to the latest releases. 
            Your manga collection starts here.
          </Text>
          <Button
            onClick={() => navigate('/browse')}
            size="lg"
            variant="primary"
            className="inline-flex items-center space-x-2"
          >
            <span>Start Browsing</span>
            <ApperIcon name="ArrowRight" size={20} />
          </Button>
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-2 h-full">
          {[...Array(64)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.01, duration: 0.5 }}
              className="bg-secondary rounded"
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;