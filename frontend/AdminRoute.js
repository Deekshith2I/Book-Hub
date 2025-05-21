import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => { //
    const [access, setAccess] = useState(null); //so sets access as null intially
    useEffect(() => {
        fetch("http://localhost/bookhub/session_status.php", { //sends request to session_status.php
            credentials: "include",
        })
            .then((res) => res.json()) //sends in json format
            .then((data) => { //checks the data 
                if (data.status === "logged_in" && data.email === "bookadmin@gmail.com") //so if both logged and admin email matches then..
                {
                    setAccess(true); //it sets to true 
                } else {
                    setAccess(false);//if not false
                }
            });
    }, []);

    if (access === null) return null; // authentication status is being checked, renders nothing  still in loading state

    return access ? children : <Navigate to="/dashboard" replace />; //so if its true then passes to children or else navigates to dashboard
};

export default AdminRoute;
