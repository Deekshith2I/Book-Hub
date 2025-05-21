import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import AdminRoute from "./components/AdminRoute";
import BookDetails from "./components/BookDetails";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AboutUs from "./components/Aboutus";
import MyFavorites from "./components/MyFavorites";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import Bookshelves from "./components/Bookshelves";
import CreateEvent from "./components/CreateEvent";
import EventsPage from "./components/EventsPage";
import AdminEvents from "./components/AdminEvents";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        {/* Protected routes (login required) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/myfavorites" element={<ProtectedRoute><MyFavorites /></ProtectedRoute>} />
        <Route path="/book/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
        <Route path="/bookshelves" element={<ProtectedRoute><Bookshelves /></ProtectedRoute>} />
        <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />

        {/* Admin-only routes */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/admin-events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
