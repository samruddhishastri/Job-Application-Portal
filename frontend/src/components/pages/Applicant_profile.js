import React from 'react';
import {Link} from 'react-router-dom';
import Axios from "axios";

class Applicant_profile extends React.Component {

    state = {
        profiles: []
    };

    componentDidMount(){
        this.getProfile();
    }

    async getProfile(){
        const token = localStorage.getItem("auth-token");
            const headers = {
                'x-auth-token': token,
                'Content-Type' : 'application/json'
        }

        const res = await Axios.get(
            "http://localhost:5000/users/applicant_profile",
            {headers : headers}
        );

        var newData = [];
        newData.push(res.data);
        this.setState({profiles: newData});
        //console.log(newData);
    }

    renderList(){
        return this.state.profiles.map(profile => {
            return (
                <table className="new-table">
                    <tr>
                        <th>Name:</th>
                        <th>{profile.displayName}</th>
                    </tr>
                    <tr>
                        <th>Education1: </th>
                        <th>
                            <tr>
                                <th>Name:</th>
                                <th>{profile.education[0].name}</th>
                            </tr>
                            <tr>
                                <th>Start Year:</th>
                                <th>{profile.education[0].start_year}</th>
                            </tr>
                            <tr>
                                <th>End Year:</th>
                                <th>{profile.education[0].end_year}</th>
                            </tr>
                        </th>
                    </tr>
                    <tr>
                    <th>Education2: </th>
                        <th>
                            <tr>
                                <th>Name:</th>
                                <th>{profile.education[1].name}</th>
                            </tr>
                            <tr>
                                <th>Start Year:</th>
                                <th>{profile.education[1].start_year}</th>
                            </tr>
                            <tr>
                                <th>End Year:</th>
                                <th>{profile.education[1].end_year}</th>
                            </tr>
                        </th>
                    </tr>
                    <tr>
                    <th>Education3: </th>
                        <th>
                            <tr>
                                <th>Name:</th>
                                <th>{profile.education[2].name}</th>
                            </tr>
                            <tr>
                                <th>Start Year:</th>
                                <th>{profile.education[2].start_year}</th>
                            </tr>
                            <tr>
                                <th>End Year:</th>
                                <th>{profile.education[2].end_year}</th>
                            </tr>
                        </th>
                    </tr>
                    <tr>
                    <th>Education4: </th>
                        <th>
                            <tr>
                                <th>Name:</th>
                                <th>{profile.education[3].name}</th>
                            </tr>
                            <tr>
                                <th>Start Year:</th>
                                <th>{profile.education[3].start_year}</th>
                            </tr>
                            <tr>
                                <th>End Year:</th>
                                <th>{profile.education[3].end_year}</th>
                            </tr>
                        </th>
                    </tr>
                    <tr>
                    {profile.skills ? (
                        <>
                        <th>Skills:</th> 
                        <th>{profile.skills.join(",")}</th>
                        </>
                    ):(
                        <th>Skills: </th>
                    )}
                    </tr>
                
                    <th>Rating:</th><th>{profile.rating}</th>
                </table>
            );
        });
    }

    render(){
        return (
        <div className="page">
            <h2>Profile</h2>
            <strong>
            {this.renderList()}
            </strong>
            <br></br>
            <Link className="edit_profile_btn" to='/applicant_register'>Edit Profile</Link>
        </div>
        );
    }
}


export default Applicant_profile;