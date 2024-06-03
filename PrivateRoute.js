import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const checkAuthentication = async () => {
      try {
        if (token) {
          // Perform any additional checks if needed
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
