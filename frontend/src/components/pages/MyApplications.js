import React from 'react';
import Axios from "axios";

class MyApplications extends React.Component {
    
    state = {
        posts: [],
        info: [],
        store_data: []
    };

    componentDidMount(){
        this.getMyApplications();
    }

    async getMyApplications(){
        const token = localStorage.getItem("auth-token");
        const headers = {
            'x-auth-token': token,
            'Content-Type' : 'application/json'
        }

        const result = await Axios.get(
            "http://localhost:5000/users/get_applicant_with_token",
            {headers : headers},
        );

        var arr = [];
        arr.push(result.data);
        this.setState({ info: arr });

        const res = await Axios.get(
            "http://localhost:5000/users/my_applications/",
            {headers : headers},
        );

        this.setState({ posts: res.data });
        
        var i; 
        var j;
        var array = [];
        for(i=0; i<this.state.posts.length; i++){
            for(j=0; j<this.state.posts[i].applicants_list.length; j++){
                if(this.state.posts[i].applicants_list[j].applicant_id === this.state.info[0]._id){
                    var usr = {id: this.state.posts[i]._id, title: this.state.posts[i].title, stage: this.state.posts[i].applicants_list[j].stage, date_of_joining: this.state.posts[i].applicants_list[j].date_of_acceptance, salary: this.state.posts[i].salary, name: this.state.posts[i].name};
                    array.push(usr);
                }
            }
        }

        this.setState({ store_data: array });
    }

    async changeRating(e, id){
        const token = localStorage.getItem("auth-token");
        const headers = {
            'x-auth-token': token,
            'Content-Type' : 'application/json'
        }

        const res = await Axios.post(
            "http://localhost:5000/users/rate_job/"+id,
            {data: e.target.value},
            {headers : headers}
        );
    }

    renderList(){
        return this.state.store_data.map(post => {
            return (
                <tr>
                    <td>{post.title}</td>
                    <td>{post.stage}</td>
                    <td>{post.date_of_joining}</td>
                    <td>{post.salary}</td>
                    <td>{post.name}</td>
                    <td>
                        <select id="rating" onChange={(e) => {this.changeRating(e, post.id)}}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </td>
                </tr>
            );
        });
    }

    render(){
        return (
        <div>
            <table className="new-table">
            <tr>
                <th>Title</th>
                <th>Stage of Application</th>
                <th>Date of joining</th>
                <th>Salary per month</th>
                <th>Name of Recruiter</th>
                <th>Rate</th>
            </tr>
            {this.renderList()}
            </table>
        </div>
        );
    }
}


export default MyApplications;