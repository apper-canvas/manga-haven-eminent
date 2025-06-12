import Home from '../pages/Home';
import Browse from '../pages/Browse';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Grid3X3',
    component: Browse
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
    component: Cart
  }
};

export const routeArray = Object.values(routes);