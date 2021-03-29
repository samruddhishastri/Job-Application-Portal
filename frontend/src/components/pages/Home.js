import React, {useEffect, useContext} from 'react';
import {useHistory} from "react-router-dom";
import UserContext from "../../context/UserContext"

export default function Home() {
    const {userData} = useContext(UserContext);
    const history = useHistory();
    localStorage.clear();
    useEffect(() => {
        if(!userData.user) history.push("/login");
    });
    return( 
        <div id="home">
            <h1>JOB APPLICATION PORTAL</h1>
            <h4>DASS ASSIGNMENT 1</h4>
        </div>
    )
}
