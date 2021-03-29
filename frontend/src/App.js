import React, {useState,useEffect } from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Axios from "axios";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Applicant_register from "./components/auth/Applicant_register";
import Recruiter_register from "./components/auth/Recruiter_register";
import Createjob from "./components/pages/Createjob";
import ShowAllJobs from "./components/pages/ShowAllJobs";
import Recruiter_jobs from "./components/pages/Recruiter_jobs";
import Applicant_profile from "./components/pages/Applicant_profile";
import Recruiter_profile from "./components/pages/Recruiter_profile";
import Editjob from "./components/pages/Editjob";
import Applyjob from "./components/pages/Applyjob";
import DisplayJob from "./components/pages/DisplayJob";
import Accepted_candidates from "./components/pages/Accepted_candidates";
import MyApplications from "./components/pages/MyApplications";
import Header from "./components/layout/Header";
import "./style.css";
import UserContext from "./context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if(token === null){
                localStorage.setItem("auth-token", "");
                token = "";
            }
            const tokenRes = await Axios.post(
                "http://localhost:5000/users/tokenIsValid", null,
                {headers: {"x-auth-token": token } }
            );
            //console.log(tokenRes.data);
            if(tokenRes.data){
                const userRes = await Axios.get("http://localhost:5000/users/", {headers: {"x-auth-token" : token},});
                setUserData({
                    token,
                    user: userRes.data,
                });
            }
        };
        checkLoggedIn();
    }, []);

    return (
    <>
        <BrowserRouter>
            <UserContext.Provider value={{ userData, setUserData }}>
                <Header />
                <div className="center-align">
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/applicant_register" component={Applicant_register} />
                        <Route path="/recruiter_register" component={Recruiter_register} />
                        <Route path="/applicant_profile" component={Applicant_profile} />
                        <Route path="/recruiter_profile" component={Recruiter_profile} />
                        <Route path="/create_job" component={Createjob} />
                        <Route path="/display_all_jobs" component={ShowAllJobs} />
                        <Route path="/recruiter_jobs" component={Recruiter_jobs} />
                        <Route path="/edit_job/:id" component={Editjob} />
                        <Route path="/apply_job/:id" component={Applyjob} />
                        <Route path="/display_job/:id" component={DisplayJob} />
                        <Route path="/accepted_candidates/" component={Accepted_candidates} />
                        <Route path="/my_applications/" component={MyApplications} />
                    </Switch>
                </div>
            </UserContext.Provider>
        </BrowserRouter>
    </>
    );
}

