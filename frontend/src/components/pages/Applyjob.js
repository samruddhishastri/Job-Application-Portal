import React, {useState, useContext} from 'react';
import { useHistory } from "react-router-dom";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import ErrorNotice from '../misc/ErrorNotice';

export default function Applyjob(props) {

    const [sop, setSop] = useState();
    const [error, setError] = useState();

    const {setUserData} = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try{
            const applyJob = {sop};
            const token = localStorage.getItem("auth-token");
            const headers = {
                'x-auth-token': token,
                'Content-Type' : 'application/json'
            }
            
            await Axios.post(
                "http://localhost:5000/users/apply_job/"+props.match.params.id, 
                {data: applyJob},
                {headers : headers},
            );
            
            history.push("/display_all_jobs");
        }
        catch(err){
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div className="page">
            <h3>Statement Of Purpose</h3>
            {error && (
                <ErrorNotice message={error} clearError={() => setError(undefined)} /> 
            )}
            <form onSubmit={submit} className="form">
                <textarea id="applicant-sop" data-max-words="10" rows="4" cols="50" placeholder = "Maximum limit is 250 words" onChange={(e) => setSop(e.target.value)}/>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}
