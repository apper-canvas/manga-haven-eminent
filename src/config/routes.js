import HomePage from '@/components/pages/HomePage';
import BrowsePage from '@/components/pages/BrowsePage';
import CartPage from '@/components/pages/CartPage';
import CheckoutPage from '@/components/pages/CheckoutPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Grid3X3',
component: BrowsePage
  },
  newReleases: {
    id: 'new-releases',
    label: 'New Releases',
    path: '/browse?sort=newest',
    icon: 'Sparkles'
  },
  genres: {
    id: 'genres',
    label: 'Genres',
    path: '/browse?filter=genres',
    icon: 'Tags'
  },
  cart: {
    id: 'cart',
    label: 'Cart',
    path: '/cart',
    icon: 'ShoppingCart',
component: CartPage
  }
};

export const routeArray = Object.values(routes);