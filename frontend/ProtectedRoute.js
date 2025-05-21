import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => { //
    const [isAuthenticated, setIsAuthenticated] = useState(null); //intially isAuthenicated kept as null 

    useEffect(() => {
        fetch("http://localhost/bookhub/session_status.php", { //sends request to session.php 
            credentials: "include",
         })
            .then((res) => res.json())
            .then((data) => {
                setIsAuthenticated(data.status === "logged_in"); //updates isAuthenticated based on session status.
            });
    }, []);

    if (isAuthenticated === null) return null; // authentication status is being checked, renders nothing  still in loading state
    return isAuthenticated ? children : <Navigate to="/" replace />; //if user is authenticated it navigates children if not redirects to the login page
};

export default ProtectedRoute;
