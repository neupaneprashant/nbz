import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminRoute from '../components/AdminRoute';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/layout/Layout';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DestinationDetailPage from '../pages/destinations/DestinationDetailPage';
import DestinationsPage from '../pages/destinations/DestinationsPage';
import FlightSearchPage from '../pages/flights/FlightSearchPage';
import FlightStatusPage from '../pages/flights/FlightStatusPage';
import TripsPage from '../pages/trips/TripsPage';
import TripDetailPage from '../pages/trips/TripDetailPage';
import TripSummaryPage from '../pages/trips/TripSummaryPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
          </Route>

          <Route path="/trips/:id/summary" element={<TripSummaryPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
          <Route path="/flights/search" element={<FlightSearchPage />} />
          <Route path="/flights/status" element={<FlightStatusPage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<div>Admin Area</div>} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
