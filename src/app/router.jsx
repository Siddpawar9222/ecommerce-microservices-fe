import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import CustomerLayout from '../components/layout/CustomerLayout';
import AdminLayout from '../components/layout/AdminLayout';
import InventoryLayout from '../components/layout/InventoryLayout';

// Route Guards
import { RequireAuth, RequireRole, GuestOnly } from '../components/common/RouteGuards';
import { ROLES } from '../utils/constants';

// Auth Pages
import LoginPage from '../features/auth/pages/LoginPage';
import UnauthorizedPage from '../features/auth/pages/UnauthorizedPage';
import NotFoundPage from '../features/auth/pages/NotFoundPage';
import ProfilePage from '../features/auth/pages/ProfilePage';

// Customer Pages
import ShopHomePage from '../features/products/pages/ShopHomePage';
import ProductListPage from '../features/products/pages/ProductListPage';
import ProductDetailPage from '../features/products/pages/ProductDetailPage';
import CartPage from '../features/cart/pages/CartPage';
import CheckoutPage from '../features/checkout/pages/CheckoutPage';
import OrderListPage from '../features/orders/pages/OrderListPage';
import OrderDetailPage from '../features/orders/pages/OrderDetailPage';

// Admin Pages
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import AdminProductListPage from '../features/admin/pages/AdminProductListPage';
import AdminProductFormPage from '../features/admin/pages/AdminProductFormPage';
import AdminOrderListPage from '../features/admin/pages/AdminOrderListPage';
import AdminCustomerListPage from '../features/admin/pages/AdminCustomerListPage';

// Inventory Pages
import InventoryDashboardPage from '../features/inventory/pages/InventoryDashboardPage';
import StockManagementPage from '../features/inventory/pages/StockManagementPage';
import LowStockAlertsPage from '../features/inventory/pages/LowStockAlertsPage';
import ReservationHistoryPage from '../features/inventory/pages/ReservationHistoryPage';

export const router = createBrowserRouter([
  // Customer Storefront & Account Routes
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <Navigate to="/shop" replace /> },
      { path: 'shop', element: <ShopHomePage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:productId', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      {
        path: 'checkout',
        element: (
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>
        ),
      },
      {
        path: 'my-orders',
        element: (
          <RequireAuth>
            <OrderListPage />
          </RequireAuth>
        ),
      },
      {
        path: 'my-orders/:orderId',
        element: (
          <RequireAuth>
            <OrderDetailPage />
          </RequireAuth>
        ),
      },
      {
        path: 'profile',
        element: (
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        ),
      },
    ],
  },

  // Admin Portal Routes
  {
    path: '/admin',
    element: (
      <RequireRole roles={[ROLES.ADMIN]}>
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'products', element: <AdminProductListPage /> },
      { path: 'products/new', element: <AdminProductFormPage /> },
      { path: 'products/:productId/edit', element: <AdminProductFormPage /> },
      { path: 'orders', element: <AdminOrderListPage /> },
      { path: 'customers', element: <AdminCustomerListPage /> },
    ],
  },

  // Inventory Management Portal Routes
  {
    path: '/inventory',
    element: (
      <RequireRole roles={[ROLES.INVENTORY_MANAGER, ROLES.ADMIN]}>
        <InventoryLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <Navigate to="/inventory/dashboard" replace /> },
      { path: 'dashboard', element: <InventoryDashboardPage /> },
      { path: 'stock', element: <StockManagementPage /> },
      { path: 'low-stock', element: <LowStockAlertsPage /> },
      { path: 'reservations', element: <ReservationHistoryPage /> },
    ],
  },

  // Public / Auth Routes
  {
    path: '/login',
    element: (
      <GuestOnly>
        <LoginPage />
      </GuestOnly>
    ),
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
