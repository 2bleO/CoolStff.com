import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductCreate from './pages/admin/AdminProductCreate';
import AdminArticleCreate from './pages/admin/AdminArticleCreate';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import UserProfile from './pages/user/UserProfile';
import UserFavorites from './pages/user/UserFavorites';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductsProvider>
          <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/article/:id" element={<ArticlePage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                
                {/* Protected User Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <UserFavorites />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/product/create" element={
                  <ProtectedRoute adminOnly>
                    <AdminProductCreate />
                  </ProtectedRoute>
                } />
                <Route path="/admin/article/create" element={
                  <ProtectedRoute adminOnly>
                    <AdminArticleCreate />
                  </ProtectedRoute>
                } />
                
                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ProductsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;