import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from './Login';
import Dashboard from './Dashboard';
import { auth } from './firebase/firebase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Show loading spinner or message while authentication state is being checked
    return <div>Loading...</div>;
  }
  
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/dashboard" component={Dashboard} isAuthenticated={isAuthenticated} />
        {/* Add more routes here */}
      </Switch>
    </Router>
  );
}

export default App;
