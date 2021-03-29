import React, {useState, useContext} from 'react';
import { useHistory } from "react-router-dom";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import ErrorNotice from '../misc/ErrorNotice';

export default function Register() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [displayName, setDisplayName] = useState();
    const [typeOfUser, setTypeOfUser] = useState();
    const [error, setError] = useState();

    const {setUserData} = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try{
            const newUser = { email, password, passwordCheck, displayName, typeOfUser };
            //console.log(newUser);
            await Axios.post(
                "http://localhost:5000/users/register", 
                newUser
            );
            const loginRes = await Axios.post("http://localhost:5000/users/login", { email, password });
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });
            localStorage.setItem("auth-token",loginRes.data.token);
            if(typeOfUser === "Applicant")
                history.push("/applicant_register");
            if(typeOfUser === "Recruiter")
                history.push("/recruiter_register");
        }
        catch(err){
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div className="page">
            <h2>Register</h2>
            {error && (
                <ErrorNotice message={error} clearError={() => setError(undefined)} /> 
            )}
            <form onSubmit={submit} className="form">
                <label htmlFor="register-displayName">Name</label>
                <input id="register-displayName" type="text" onChange={(e) => setDisplayName(e.target.value)}/>
                <label htmlFor="register-email">Email</label>
                <input id="register-email" type="email" onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="register-password">Password</label>
                <input id="register-password" type="password" onChange={(e) => setPassword(e.target.value)}/>
                <label htmlFor="register-passwordCheck">Confirm Password</label>
                <input id="register-passwordCheck" type="password" onChange={(e) => setPasswordCheck(e.target.value)}/>
                <label htmlFor="register-typeOfUser">Type Of User</label>
                <select id="register-typeOfUser" onChange={(e) => setTypeOfUser(e.target.value)}>
                    <option style={{display: 'none'}}>--Select--</option>
                    <option value="Applicant">Applicant</option>
                    <option value="Recruiter">Recruiter</option>
                </select>
                <input type="submit" value="Register" />
            </form>
        </div>
    )
}
