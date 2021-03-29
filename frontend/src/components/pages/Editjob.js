import React from 'react';
import {Link} from 'react-router-dom';
import Axios from "axios";
import { useHistory } from "react-router-dom";
import Datetime from 'react-datetime';

class Editjob extends React.Component {
    constructor(){
        super();
        this.state = {
            max_applications: 0,
            max_positions: 0,
            deadline: "0000-0-00T00:00",
        };
        this.changeMaxApplications = this.changeMaxApplications.bind(this);
        this.changeMaxPositions = this.changeMaxPositions.bind(this);
        this.changeDeadline = this.changeDeadline.bind(this);
    }

    componentDidMount(){
        this.getPost();
    }

    async getPost(){
        const res = await Axios.get(
            "http://localhost:5000/users/display_job/"+this.props.match.params.id);
        this.setState({ max_applications: res.data.max_applications });
        this.setState({ max_positions: res.data.max_positions });
        this.setState({ deadline: res.data.deadline.split(".")[0] });
    }

    submit_func = async(e) => {
        e.preventDefault();
        try{
            const max_applications = this.state.max_applications;
            const max_positions = this.state.max_positions;
            const deadline = this.state.deadline;
            
            const updatePost = { max_applications, max_positions, deadline };
            const x = await Axios.post(
                "http://localhost:5000/users/edit_job/"+this.props.match.params.id, 
                {data: updatePost},
            );
            //console.log("Done");
            this.props.history.push("/recruiter_jobs");
        }
        catch(err){
           console.log(err.response);
        }
    };

    changeMaxApplications(e){
        this.setState({ max_applications: e.target.value }, () => {
            ;//console.log(this.state.max_applications);
        });
    }

    changeMaxPositions(e){
        this.setState({ max_positions: e.target.value }, () => {
            ;//console.log(this.state.max_posiions);
        });
    }

    changeDeadline(e){
        this.setState({ deadline: e.target.value }, () => {
            ;//console.log(this.state.deadline);
        });
    }

    renderList(){
        return (
            <form className="form" onSubmit={this.submit_func}>
            <label htmlFor="create_job-max_applications">Maximum number of Applications</label>
            <input id="create_job-max_applications" type="number" value={this.state.max_applications} onChange={(e) => {this.changeMaxApplications(e)}}/>
            <label htmlFor="create_job-max_positions">Maximum number of Positions</label>
            <input id="create_job-max_positions" type="number" value={this.state.max_positions} onChange={(e) => {this.changeMaxPositions(e)}}/>
            <label htmlFor="create_job-deadline">Deadline</label>
            <input id="create_job-deadline" type="datetime-local" value={this.state.deadline} onChange={(e) => {this.changeDeadline(e)}}/>
            <input type="submit" value="Update Job"/>
        </form>
        );
    }

    render(){
        return (
        <div>
            {this.renderList()}
        </div>
        );
    }
}


export default Editjob;