import React, {useContext} from 'react';
import {useHistory} from "react-router-dom";
import UserContext from "../../context/UserContext";

export default function AuthOptions() {

    const {userData, setUserData} = useContext(UserContext);

    const history = useHistory();

    const register = () => history.push("/register");
    const login = () => history.push("/login");
    const logout = () => {
        setUserData({
            token:undefined,
            user:undefined,
        });
        localStorage.setItem("auth-token", "");
    };

    const profile = () => {
        if(userData.user.typeOfUser === "Applicant"){
            history.push("/applicant_profile");   
        }
        else{
            history.push("/recruiter_profile");
        }
    }

    const home = () => {
        if(userData.user.typeOfUser === "Applicant"){
            history.push("/display_all_jobs");   
        }
        else{
            history.push("/recruiter_jobs");
        }
    }

    return (
        <nav className="auth-options">
            {userData.user ? (
                <> 
                    <button onClick={home}>Home</button>
                    <button onClick={profile}>Profile</button>
                    <button onClick={logout}>Log Out</button>
                </>
            ) : (
                <>
                    <button onClick={register}>Register</button>
                    <button onClick={login}>Login</button>
                </>
            )}
        </nav>
    )
}
