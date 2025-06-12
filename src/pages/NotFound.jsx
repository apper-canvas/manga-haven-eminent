import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
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
          <div className="text-9xl font-display font-bold text-primary mb-4">404</div>
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
          <h1 className="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
            PAGE NOT FOUND
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            The manga you're looking for seems to have wandered off to another dimension. 
            Let's get you back on track!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <ApperIcon name="Home" size={20} />
              <span>Go Home</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/browse')}
              className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center space-x-2"
            >
              <ApperIcon name="Search" size={20} />
              <span>Browse Manga</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-gray-400 text-sm"
        >
          <p>Lost? Try using the navigation menu above or search for your favorite manga.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;