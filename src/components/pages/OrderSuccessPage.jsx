import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import OrderConfirmation from '@/components/organisms/OrderConfirmation';
import { orderService } from '@/services';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    const loadOrder = async () => {
      try {
        const orderData = await orderService.getById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to load order:', error);
        navigate('/'); // Redirect if order not found or error
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size={48} className="text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message="We couldn't find your order details." iconName="AlertTriangle">
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            size="md"
            className="mt-4"
          >
            Return Home
          </Button>
        </ErrorMessage>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OrderConfirmation order={order} />
    </div>
  );
};

export default OrderSuccessPage;