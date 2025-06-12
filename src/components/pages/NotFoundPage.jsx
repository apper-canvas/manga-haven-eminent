import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-8"
        >
          <Text as="div" className="text-9xl font-display font-bold text-primary mb-4">404</Text>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ApperIcon name="BookOpen" size={80} className="text-gray-300 mx-auto" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Text as="h1" variant="h3" className="md:text-3xl font-bold text-secondary mb-4">
            PAGE NOT FOUND
          </Text>
          <Text variant="body" className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            The manga you're looking for seems to have wandered off to another dimension. 
            Let's get you back on track!
          </Text>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              size="md"
              className="space-x-2"
            >
              <ApperIcon name="Home" size={20} />
              <span>Go Home</span>
            </Button>

            <Button
              onClick={() => navigate('/browse')}
              variant="outline"
              size="md"
              className="space-x-2"
            >
              <ApperIcon name="Search" size={20} />
              <span>Browse Manga</span>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-gray-400 text-sm"
        >
          <Text variant="small">Lost? Try using the navigation menu above or search for your favorite manga.</Text>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;