import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import ClerkLogin from './components/auth/ClerkLogin';
import ClerkSignup from './components/auth/ClerkSignup';
import ClerkForgotPassword from './components/auth/ClerkForgotPassword';
import DashboardHome from './pages/DashboardHome';
import ProfileSettings from './pages/ProfileSettings';
import PublicProfile from './pages/PublicProfile';
import Network from './pages/Network';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Referrals from './pages/Referrals';
import Gallery from './pages/Gallery';
import ContactUs from './pages/ContactUs';
import Messaging from './pages/Messaging';
import Notifications from './pages/Notifications';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Franchise from './pages/Franchise';
import FranchiseApply from './pages/FranchiseApply';
import ProtectedRoute from './components/ProtectedRoute';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing Publishable Key: VITE_CLERK_PUBLISHABLE_KEY needs to be set in your .env file");
}

// Redirect component for authenticated users
function HomeRedirect() {
  const { isAuthenticated, loading } = useAuth();

  // Optimization for LCP: Render Home immediately.
  // Do not block paint with a loading spinner.

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return <Home />;
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<ClerkLogin />} />
            <Route path="/signup" element={<ClerkSignup />} />
            <Route
              path="/sso-callback"
              element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl="/dashboard/home" signInForceRedirectUrl="/dashboard/home" />}
            />
            <Route path="/forgot-password" element={<ClerkForgotPassword />} />
            <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />
            <Route
              path="/dashboard/contact"
              element={
                <ProtectedRoute>
                  <ContactUs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/home"
              element={
                <ProtectedRoute>
                  <DashboardHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/home/connections"
              element={
                <ProtectedRoute>
                  <Network />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/home/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/home/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/home/referrals"
              element={
                <ProtectedRoute>
                  <Referrals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/home/gallery"
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messaging"
              element={
                <ProtectedRoute>
                  <Messaging />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route path="/profile/:userId" element={<PublicProfile />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/franchise" element={<Franchise />} />
            <Route path="/franchise/apply" element={<FranchiseApply />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;
