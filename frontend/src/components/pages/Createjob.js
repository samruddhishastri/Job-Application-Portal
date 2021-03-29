import React, {useState, useContext} from 'react';
import { useHistory } from "react-router-dom";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import ErrorNotice from '../misc/ErrorNotice';
import Datetime from 'react-datetime';

export default function Createjob() {

    const [title, setTitle] = useState();
    const [max_applications, setMax_applications] = useState();
    const [max_positions, setMax_positions] = useState();
    const [deadline, setDeadline] = useState();
    const [skill_set, setSkill_set] = useState();
    const [typeOfJob, setTypeOfJob] = useState();
    const [duration, setDuration] = useState();
    const [salary, setSalary] = useState();
    
    const [error, setError] = useState();

    const {setUserData} = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try{

            const  newPost = { title, max_applications, max_positions, deadline, skill_set, typeOfJob, duration, salary };
            const token = localStorage.getItem("auth-token");
            const headers = {
                'x-auth-token': token,
                'Content-Type' : 'application/json'
            }

            const x = await Axios.post(
                "http://localhost:5000/users/new_job", 
                {data: newPost},
                {headers : headers},
            );

            //console.log(x);

            history.push("/recruiter_jobs");
        }
        catch(err){
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div className="page">
            <h2>Create new job post</h2>
            {error && (
                <ErrorNotice message={error} clearError={() => setError(undefined)} /> 
            )}
            <form onSubmit={submit} className="form">
                <label htmlFor="create_job-title">Title</label>
                <input id="create_job-title" type="text" onChange={(e) => setTitle(e.target.value)}/>
                <label htmlFor="create_job-skill_set">Skills Required</label>
                <input id="create_job-skill_set" type="text" onChange={(e) => setSkill_set(e.target.value.split(','))}/>
                <label htmlFor="create_job-max_applications">Maximum number of Applications</label>
                <input id="create_job-max_applications" type="number" onChange={(e) => setMax_applications(e.target.value)}/>
                <label htmlFor="create_job-max_positions">Maximum number of Positions</label>
                <input id="create_job-max_positions" type="number" onChange={(e) => setMax_positions(e.target.value)}/>
                <label htmlFor="create_job-deadline">Deadline</label>
                <input id="create_job-deadline" type="datetime-local" onChange={(e) => setDeadline(e.target.value)}/>
                <label htmlFor="create_job-typeOfJob">Type Of Job</label>
                <select id="create_job-typeOfJob" onChange={(e) => setTypeOfJob(e.target.value)}>
                    <option style={{display: 'none'}}>--Select--</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Work-from-home">Work from Home</option>
                </select>
                <label htmlFor="create_job-duration">Duration</label>
                <select id="create_job-duration" onChange={(e) => setDuration(e.target.value)}>
                    <option style={{display: 'none'}}>--Select--</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select>
                <label htmlFor="create_job-salary">Salary (per month)</label>
                <input id="create_job-salary" type="number" onChange={(e) => setSalary(e.target.value)}/>
                <input type="submit" value="Create Job" />
            </form>
        </div>
    )
}
