import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ExamplesList from './pages/customer/example/Example.jsx';
import ExamplesAdminPage from './pages/admin/example/Example.jsx';
import PrivateRoute from './components/privateRoute/PrivateRoute.jsx';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/customer/login/Login.jsx';
import SignupPage from './pages/customer/signup/Signup.jsx';
import NotFoundPage from './pages/customer/notFound/NotFound.jsx';
import Layout from "./components/layout/Layout.jsx";
import AdminRoute from './components/adminRoute/AdminRoute.jsx';
import Cart from './pages/customer/cart/Cart.jsx';
import { getCurrentUser } from './redux/auth/auth.slice.js';

function App() {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const isAdmin = useSelector(state => state.auth.isAdmin);  // Assume that this is a boolean  true or false

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [token, dispatch]);

  return (
    <div className="App">
      <Routes>
        {/* Private Routes */}
        <Route path="/" element={
          <PrivateRoute token={token}>
            <Layout />
          </PrivateRoute>
        }>
          <Route path="/" element={<ExamplesList />} />
          <Route path="/products" element={<ExamplesList />} />
          <Route path="/my-orders" element={<ExamplesList />} />
          <Route path="/shop" element={<Cart />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute isAdmin={isAdmin}>
            <Layout />
          </AdminRoute>
        }>
          <Route path="examples" element={<ExamplesAdminPage />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
