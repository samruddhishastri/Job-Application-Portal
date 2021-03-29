import React, {useState, useContext} from 'react';
import { useHistory } from "react-router-dom";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import ErrorNotice from '../misc/ErrorNotice';

export default function Login() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const {setUserData} = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        try{
            e.preventDefault();
            const loginUser = { email, password };
            const loginRes= await Axios.post("http://localhost:5000/users/login", loginUser);
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });
            localStorage.setItem("auth-token",loginRes.data.token);
            if(loginRes.data.user.typeOfUser === "Applicant")
                history.push("/display_all_jobs");
            if(loginRes.data.user.typeOfUser === "Recruiter")
                history.push("/recruiter_jobs");
        }
        catch(err){
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div className="page">
            <h2>Login</h2>
            {error && (
                <ErrorNotice message={error} clearError={() => setError(undefined)} /> 
            )}
            <form onSubmit={submit} className="form">
                <label htmlFor="login-email">Email</label>
                <input id="login-email" type="email" onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="login-password">Password</label>
                <input id="login-password" type="password" onChange={(e) => setPassword(e.target.value)}/>
                <input type="submit" value="Login" />
            </form>
        </div>
    )
}