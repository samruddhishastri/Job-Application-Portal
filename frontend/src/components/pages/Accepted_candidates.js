import React from 'react';
import Axios from "axios";

class Accepted_candidates extends React.Component {
    
    state = {
        posts: [],
        info: [],
        sortField: "name",
        sortType: 'asc',
    };

    componentDidMount(){
        this.getAcceptedCandidates();
    }

    async getAcceptedCandidates(){
        const token = localStorage.getItem("auth-token");
        const headers = {
            'x-auth-token': token,
            'Content-Type' : 'application/json'
        }

        const res = await Axios.get(
            "http://localhost:5000/users/recruiter_jobs/",
            {headers : headers},
        );

        this.setState({ posts: res.data });

        var i;
        var j;
        var array = [];
        for(i=0; i<this.state.posts.length; i++){
            for(j=0; j<this.state.posts[i].applicants_list.length; j++){
                if(this.state.posts[i].applicants_list[j].stage === "Accepted"){
                    const result = await Axios.get(
                        "http://localhost:5000/users/get_applicant/"+this.state.posts[i].applicants_list[j].applicant_id,
                    );
                    array.push({id: result.data._id, name: result.data.displayName, date_of_joining: this.state.posts[i].applicants_list[j].date_of_acceptance, typeOfJob: this.state.posts[i].typeOfJob, title: this.state.posts[i].title, rating: result.data.rating})
                }
            }
        }
        this.setState({ info: array });
    }

    changeSortField(e){
        this.setState({ sortField: e.target.value }, () => {
            ;//console.log(this.state.contact_no);
        });
    }

    changeSortType(e){
        this.setState({ sortType: e.target.value }, () => {
            ;//console.log(this.state.contact_no);
        });
    }

    async changeRating(e, id){
        const token = localStorage.getItem("auth-token");
        const headers = {
            'x-auth-token': token,
            'Content-Type' : 'application/json'
        }

        const res = await Axios.post(
            "http://localhost:5000/users/rate_candidate/"+id,
            {data: e.target.value},
            {headers : headers}
        );

        window.location.reload();
    }


    renderList(){
        const {sortType, sortField} = this.state;

        const sorted = this.state.info.sort( (a, b) => {
            const isReversed = (sortType === 'asc') ? 1 : -1;
            if(sortField === "name")
                return isReversed * a.name.toString().localeCompare(b.name.toString());
            if(sortField === "title")
                return isReversed * a.title.toString().localeCompare(b.title.toString());
            if(sortField === "date_of_joining")
                return isReversed * (a.date_of_joining - b.date_of_joining);
            if(sortField === "rating")
                return isReversed * (a.rating - b.rating);
        });

        return this.state.info.map(usr => {
            return (
                <tr>
                    <td>{usr.name}</td>
                    <td>{usr.date_of_joining}</td>
                    <td>{usr.typeOfJob}</td>
                    <td>{usr.title}</td>
                    <td>{usr.rating}</td>
                    <td>
                        <select id="rating" onChange={(e) => {this.changeRating(e, usr.id)}}>
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
            <div className="sort_another">
                Sort:<select value={this.state.sortField} onChange={(e) => {this.changeSortField(e)}}>
                    <option value="name">Name</option>
                    <option value="date_of_joining">Date of Joining</option>
                    <option value="title">Title</option>
                    <option value="rating">Rating</option>
                </select>
                <select value={this.state.sortType} onChange={(e) => {this.changeSortType(e)}}>
                    <option>asc</option>
                    <option>desc</option>
                </select>
            </div>
            <table className="new-table">
            <tr>
                <th>Name</th>
                <th>Date of joining</th>
                <th>Type of Job</th>
                <th>Job title</th>
                <th>Rating</th>
                <th>Rate</th>
            </tr>
            {this.renderList()}
            </table>
        </div>
        );
    }
}


export default Accepted_candidates;