import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Eagerly load Navbar since it must be visible immediately
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DigitalCursor from './components/DigitalCursor';

// Lazy load section components for code splitting
const Hero = lazy(() => import('./components/Hero'));
const Courses = lazy(() => import('./components/Courses'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const CertificateVerification = lazy(() => import('./components/CertificateVerification'));
const CertificateAdmin = lazy(() => import('./components/CertificateAdmin'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const HomeContent = () => (
  <>
    <Suspense fallback={<SectionLoader />}>
      <Hero />
    </Suspense>

    <Suspense fallback={<SectionLoader />}>
      <Courses />
    </Suspense>

    <Suspense fallback={<SectionLoader />}>
      <About />
    </Suspense>

    <Suspense fallback={<SectionLoader />}>
      <Contact />
    </Suspense>
  </>
);

/**
 * SectionLoader — lightweight loading fallback for lazy sections
 */
function SectionLoader() {
  return (
    <div
      className="flex items-center justify-center min-h-[200px] bg-[#0a0a0f]"
      role="status"
      aria-label="Loading section..."
    >
      <motion.div
        className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * App — root component wiring all sections together as a single page
 */
export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <DigitalCursor />

      {/* Sticky Navigation */}
      <Navbar />

      {/* Main page content */}
      <main id="main-content" role="main">
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route
            path="/certificate"
            element={
              <Suspense fallback={<SectionLoader />}>
                <CertificateVerification />
              </Suspense>
            }
          />
          <Route
            path="/admin-login"
            element={
              <Suspense fallback={<SectionLoader />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/certificate-admin"
            element={
              <Suspense fallback={<SectionLoader />}>
                <ProtectedRoute>
                  <CertificateAdmin />
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
}
