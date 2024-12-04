import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import ForgetPassword from './components/ForgetPassword';
import ProtectedRoute from './ProtectedRoute';
import Navigation from './components/Navigation';
import ViewHome from './components/ViewHome';
import CreateTicket from './components/CreateTicket';
import ViewTicketList from './components/ViewTicketList';
import ViewTicket from './components/ViewTicket';
import ViewWorkOrder from './components/ViewWorkOrder';
import ViewWorkOrderList from './components/ViewWorkOrderList';
import ViewUserList from './components/ViewUserList';
import CreateUser from './components/CreateUser';
import ViewInstallations from './components/ViewInstallations';
import ViewInstallationsSingle from './components/ViewInstallationsSingle';
import ViewDocuments from './components/ViewDocuments';
import ViewCalendars from './components/ViewCalendar';
import PasswordUpdate from './components/PasswordUpdate';
import NotFound from './components/NotFound';
import './App.css';

function AppContent() {
  const location = useLocation();
  
  return (
    <>
      {/* Only render Navigation if not on the /login page */}
      {location.pathname !== '/login' && location.pathname !== '/forgot-password' && location.pathname !== '/create-user' && <Navigation />}
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ViewHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <ViewTicketList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket/:ticketId"
          element={
            <ProtectedRoute>
              <ViewTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workorders"
          element={
            <ProtectedRoute>
              <ViewWorkOrderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workorder/:workOrderId"
          element={
            <ProtectedRoute>
              <ViewWorkOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/installations"
          element={
            <ProtectedRoute>
              <ViewInstallations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/installation/:InstallationId"
          element={
            <ProtectedRoute>
              <ViewInstallationsSingle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <ViewDocuments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <ViewUserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <ViewCalendars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-password"
          element={
            <ProtectedRoute>
              <PasswordUpdate />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router basename="/service-desk">
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;