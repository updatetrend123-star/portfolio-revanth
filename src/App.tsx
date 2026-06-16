/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { lazy, Suspense } from 'react';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import Layout from '@/src/components/Layout';
import ScrollToTop from '@/src/components/ScrollToTop';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { AuthProvider } from '@/src/context/AuthContext';
import { PortfolioProvider } from '@/src/context/PortfolioContext';

// Lazy Loaded Pages
const Home = lazy(() => import('@/src/pages/Home'));
const Projects = lazy(() => import('@/src/pages/Projects'));
const Services = lazy(() => import('@/src/pages/Services'));
const Contact = lazy(() => import('@/src/pages/Contact'));
const AdminLogin = lazy(() => import('@/src/pages/Admin/Login'));
const AdminDashboard = lazy(() => import('@/src/pages/Admin/Dashboard'));

import { Toaster } from 'sonner';

function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Glow backdrop indicator */}
        <div className="absolute w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
        {/* Futuristic glowing spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-16 h-16 rounded-full border-t-2 border-b-2 border-accent border-l-2 border-r-transparent shadow-[0_0_40px_rgba(167,170,99,0.25)]"
        />
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="mt-8 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-accent/80"
        >
          Syncing Nexus...
        </motion.span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <Router>
        <ScrollToTop />
        <Toaster position="top-right" theme="dark" richColors />
        <div className="flex flex-col min-h-screen bg-primary text-beige">
          <Navbar />
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/projects" element={<Layout><Projects /></Layout>} />
                <Route path="/services" element={<Layout><Services /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                
                {/* Admin Routes */}
                <Route path="/login" element={<Layout><AdminLogin /></Layout>} />
                <Route path="/admin/login" element={<Layout><AdminLogin /></Layout>} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Fallback */}
                <Route path="*" element={<Layout><Home /></Layout>} />
              </Routes>
            </AnimatePresence>
          </Suspense>
          <Footer />
        </div>
      </Router>
      </PortfolioProvider>
    </AuthProvider>
  );
}

