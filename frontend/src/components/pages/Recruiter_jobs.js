import React from 'react';
import {Link} from 'react-router-dom';
import Axios from "axios";

class Recruiter_jobs extends React.Component {
    state = {
        posts: []
    };

    componentDidMount(){
        this.getPosts();
    }

    async getPosts(){
        const token = localStorage.getItem("auth-token");
            const headers = {
                'x-auth-token': token,
                'Content-Type' : 'application/json'
        }

        const res = await Axios.get(
            "http://localhost:5000/users/recruiter_jobs/",
            {headers : headers},
        );
        //console.log(res.data);
        this.setState({ posts: res.data });
    }

    async delete_job(post){

        const res = await Axios.post(
            "http://localhost:5000/users/delete_job/",
            post
        );
        window.location.reload();
    }


    renderList(){
        return this.state.posts.map(post => {
            return (
                <tr>
                    <td><a href={'/display_job/'+post._id}>{post.title}</a></td>
                    <td>{post.date}</td>
                    <td>{post.deadline}</td>
                    <td>{post.applicants_list.length}</td>
                    <td>{post.max_applications}</td>
                    <td>{post.max_positions}</td>
                    <td><a className="edit_job_btn" href={'/edit_job/'+post._id}>Edit Job</a></td>
                    <td><button className="delete_job_btn" onClick={()=>{this.delete_job(post);}}>Delete Job</button></td>
                </tr>
            );
        });
    }

    render(){
        return (
        <div>
            <Link className="create_job_btn" to='/create_job'>Create Job</Link>
            <Link className="accepted_candidates_btn" to='/accepted_candidates' >Accepted candidates</Link>
            <center><h2 style={{marginTop: "2rem"}}>MY JOBS</h2></center>
            {"\n"}
            <table className="new-table">
            <tr>
                <th>Title</th>
                <th>Date of posting</th>
                <th>Deadline</th>
                <th>Number of Applicants</th>
                <th>Maximum applications</th>
                <th>Maximum positions</th>
                <th></th>
                <th></th>
            </tr>
            {this.renderList()}
            </table>
        </div>
        );
    }
}


export default Recruiter_jobs;