import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import ProductDetailsDisplay from '@/components/organisms/ProductDetailsDisplay';
import RelatedProductsSection from '@/components/organisms/RelatedProductsSection';
import { mangaService } from '@/services';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedManga, setRelatedManga] = useState([]);

  useEffect(() => {
    const loadManga = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await mangaService.getById(id);
        if (!data) {
          throw new Error('Manga not found');
        }
        setManga(data);

        const allManga = await mangaService.getAll();
        const related = allManga
          .filter(item => 
            item.id !== id && (
              item.series === data.series ||
              item.genres.some(genre => data.genres.includes(genre))
            )
          )
          .slice(0, 4);
        setRelatedManga(related);
      } catch (err) {
        setError(err.message || 'Failed to load manga details');
      } finally {
        setLoading(false);
      }
    };

    loadManga();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton type="productDetail" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error}>
          <Button
            onClick={() => navigate('/browse')}
            variant="primary"
            size="md"
            className="mt-4"
          >
            Back to Browse
          </Button>
        </ErrorMessage>
      </div>
    );
  }

  if (!manga) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.nav
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center space-x-2 text-sm text-gray-500 mb-8"
        >
          <Button onClick={() => navigate('/browse')} variant="ghost" size="sm" className="hover:text-primary p-0">
            Browse
          </Button>
          <ApperIcon name="ChevronRight" size={16} />
          <Text variant="small" className="text-gray-900">{manga.title}</Text>
        </motion.nav>

        <ProductDetailsDisplay manga={manga} />
        <RelatedProductsSection relatedManga={relatedManga} />
      </div>
    </div>
  );
};

export default ProductDetailPage;