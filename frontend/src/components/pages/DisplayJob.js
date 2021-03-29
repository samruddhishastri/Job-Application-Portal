import React from 'react';
import Axios from "axios";

class DisplayJob extends React.Component {
    state = {
        applicants: [],
        applicants_info: [],
        sortField: "name",
        sortType: 'asc',
    };

    componentDidMount(){
        this.getAllApplicants();
    }

    async getAllApplicants(){
        const token = localStorage.getItem("auth-token");
            const headers = {
                'x-auth-token': token,
                'Content-Type' : 'application/json'
        }

        const res = await Axios.get(
            "http://localhost:5000/users/display_job/"+this.props.match.params.id,
            {headers : headers},
        );
        this.setState({ applicants: res.data.applicants_list });

        //console.log(this.state.applicants);

        var i;
        var array = [];
        for(i=0; i<this.state.applicants.length; i++){
            const result = await Axios.get(
                "http://localhost:5000/users/get_applicant/"+this.state.applicants[i].applicant_id,
            );
            const temp = {_id: result.data._id, displayName: result.data.displayName, skills: result.data.skills, education: result.data.education, date_of_application: this.state.applicants[i].date_of_application, rating: result.data.rating, sop: this.state.applicants[i].sop, stage: this.state.applicants[i].stage};
            array.push(temp);
        }
        this.setState({ applicants_info: array });
    }

    stage_applicant(stg){
        if(stg === "Applied")
        return true;
        else
        return false;
    }

    stage_rejected(stg){
        if(stg === "Rejected")
        return true;
        else
        return false;
    }

    stage_accepted(stg){
        if(stg === "Accepted")
        return true;
        else
        return false;
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

    async shortlist_candidate(applicant){
        //console.log(applicant._id);
        const id = applicant._id;
        const usr = {id};
        //console.log(usr);
        const token = localStorage.getItem("auth-token");
        const headers = {
            'x-auth-token': token,
            'Content-Type' : 'application/json'
        }
        const res = await Axios.post(
            "http://localhost:5000/users/shortlist_candidate/"+this.props.match.params.id,
            {data: usr},
            {headers : headers}
        );
        window.location.reload();
        //console.log("New world");
    }

    async accept_candidate(id){
        const usr = {id};
        const token = localStorage.getItem("auth-token");
            const headers = {
                'x-auth-token': token,
                'Content-Type' : 'application/json'
        }
        const res = await Axios.post(
            "http://localhost:5000/users/accept_candidate/"+this.props.match.params.id,
            {data: usr},
            {headers : headers}
        );
        window.location.reload();
    }

    async reject_candidate(id){
        const usr = {id};
        const token = localStorage.getItem("auth-token");
            const headers = {
                'x-auth-token': token,
                'Content-Type' : 'application/json'
        }
        const res = await Axios.post(
            "http://localhost:5000/users/reject_candidate/"+this.props.match.params.id,
            {data: usr},
            {headers : headers}
        );
        window.location.reload();
    }

    renderList(){
        const {sortType, sortField} = this.state;

        const sorted = this.state.applicants_info.sort( (a, b) => {
            const isReversed = (sortType === 'asc') ? 1 : -1;
            if(sortField === "name")
                return isReversed * a.displayName.toString().localeCompare(b.displayName.toString());
            if(sortField === "date_of_application")
                return isReversed * (a.date_of_application.getTime() - b.date_of_application.getTime());
            if(sortField === "rating")
                return isReversed * (a.rating - b.rating);
        });

        return sorted.map(applicant => {
            return (
                <>
                {
                    this.stage_rejected(applicant.stage)?
                    (<></>):
                    (
                        this.stage_accepted(applicant.stage)?
                        (<></>):
                        (
                            <>
                            <tr>
                                <td>{applicant.displayName}</td>
                                {applicant.skills?(                    
                                <td>{applicant.skills.join()}</td>
                                ):(
                                <td><></></td>
                                )}
                                <td>
                                <table>
                                <tr>
                                    <th>Education1: </th>
                                    <th>
                                        <tr>
                                            <th>Name:</th>
                                            <th>{applicant.education[0].name}</th>
                                        </tr>
                                        <tr>
                                            <th>Start Year:</th>
                                            <th>{applicant.education[0].start_year}</th>
                                        </tr>
                                        <tr>
                                            <th>End Year:</th>
                                            <th>{applicant.education[0].end_year}</th>
                                        </tr>
                                    </th>
                                </tr>
                                <tr>
                                <th>Education2: </th>
                                    <th>
                                        <tr>
                                            <th>Name:</th>
                                            <th>{applicant.education[1].name}</th>
                                        </tr>
                                        <tr>
                                            <th>Start Year:</th>
                                            <th>{applicant.education[1].start_year}</th>
                                        </tr>
                                        <tr>
                                            <th>End Year:</th>
                                            <th>{applicant.education[1].end_year}</th>
                                        </tr>
                                    </th>
                                </tr>
                                <tr>
                                <th>Education3: </th>
                                    <th>
                                        <tr>
                                            <th>Name:</th>
                                            <th>{applicant.education[2].name}</th>
                                        </tr>
                                        <tr>
                                            <th>Start Year:</th>
                                            <th>{applicant.education[2].start_year}</th>
                                        </tr>
                                        <tr>
                                            <th>End Year:</th>
                                            <th>{applicant.education[2].end_year}</th>
                                        </tr>
                                    </th>
                                </tr>
                                <tr>
                                <th>Education4: </th>
                                    <th>
                                        <tr>
                                            <th>Name:</th>
                                            <th>{applicant.education[3].name}</th>
                                        </tr>
                                        <tr>
                                            <th>Start Year:</th>
                                            <th>{applicant.education[3].start_year}</th>
                                        </tr>
                                        <tr>
                                            <th>End Year:</th>
                                            <th>{applicant.education[3].end_year}</th>
                                        </tr>
                                    </th>
                                </tr>
                                </table>
                                </td>
                                <td>{applicant.date_of_application}</td>
                                <td>{applicant.sop}</td>
                                <td>{applicant.rating}</td>
                                <td>{applicant.stage}</td>
                                {
                                    this.stage_applicant(applicant.stage)? (
                                        <td><button className="edit_job_btn" onClick={()=>{this.shortlist_candidate(applicant)}}>Shortlist</button></td>
                                    ):(
                                        <td><button className="edit_profile_btn" onClick={()=>{this.accept_candidate(applicant)}}>Accept</button></td>
                                    )
                                }
                                <td><button className="delete_job_btn" onClick={()=>{this.reject_candidate(applicant)}}>Reject</button></td>
                            </tr>
                            </>
                        )
                    )
                }
                </>
            );
        });
    }

    render(){
        return (
        <div>
            <div className="sort_another">
            Sort:<select value={this.state.sortField} onChange={(e) => {this.changeSortField(e)}}>
                <option value="name">Name</option>
                <option value="date_of_application">Date of Application</option>
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
                <th>Skills</th>
                <th>Education</th>
                <th>Date of Application</th>
                <th>SOP</th>
                <th>Rating</th>
                <th>Stage of Application</th>
                <th></th>
                <th></th>
            </tr>
            {this.renderList()}
            </table>
        </div>
        );
    }
}


export default DisplayJob;