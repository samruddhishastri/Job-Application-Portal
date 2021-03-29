import React from 'react';
import {Link} from 'react-router-dom';
import Axios from "axios";

class Recruiter_profile extends React.Component {

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
            "http://localhost:5000/users/recruiter_profile",
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
                <>
                <h5>Name: {profile.displayName}</h5>
                <h5>Email: {profile.email}</h5>
                <h5>Contact_no: {profile.contact_no}</h5>
                <h5>Bio: {profile.bio}</h5>
                </>
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
            <Link className="edit_profile_btn" to='/recruiter_register'>Edit Profile</Link>
        </div>
        );
    }
}


export default Recruiter_profile;