import React from 'react';
import Axios from "axios";
import ErrorNotice from '../misc/ErrorNotice';

class Recruiter_register extends React.Component {
    constructor(){
        super();
        this.state = {
            contact_no: undefined,
            bio: undefined,
            error: undefined,
        };
        this.changeContact_no = this.changeContact_no.bind(this);
        this.changeBio = this.changeBio.bind(this);
    }

    componentDidMount(){
        this.getInfo();
    }

    async getInfo(){
        const token = localStorage.getItem("auth-token");
        const headers = {
            'x-auth-token': token,
            'Content-Type' : 'application/json'
        }
        const res = await Axios.get(
            "http://localhost:5000/users/recruiter_profile", 
            {headers : headers}
        );

        this.setState({ contact_no: res.data.contact_no });
        this.setState({ bio: res.data.bio });
    }

    submit_func = async(e) => {
        e.preventDefault();
        try{
            const contact_no = this.state.contact_no;
            const bio = this.state.bio;
            const token = localStorage.getItem("auth-token");
            const headers = {
                'x-auth-token': token,
                'Content-Type' : 'application/json'
            }
            const infoUsr = { contact_no, bio };
            const x = await Axios.post(
                "http://localhost:5000/users/recruiter_register/", 
                {data: infoUsr},
                {headers: headers}
            );
            this.props.history.push("/recruiter_profile");
        }
        catch(err){
           //console.log(err.response);
           err.response.data.msg && this.setState({error: err.response.data.msg});
        }
    };

    changeContact_no(e){
        this.setState({ contact_no: e.target.value }, () => {
            ;//console.log(this.state.contact_no);
        });
    }

    changeBio(e){
        this.setState({ bio: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    renderList(){
        return (
        <form className="form" onSubmit={this.submit_func}>
            <label htmlFor="recruiter_contact_no">Contact no. (123-456-7890)</label>
            <input type="tel" id="recruiter_register-contact_no" placeholder="123-456-7890" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value={this.state.contact_no} onChange={(e) => {this.changeContact_no(e)}}/>
            <label htmlFor="recruiter_bio">Bio (Maximum limit: 250 words)</label>
            <textarea id="recruiter_register-bio" data-max-words="10" rows="4" cols="50" placeholder = "Maximum limit is 250 words" value={this.state.bio} onChange={(e) => {this.changeBio(e)}}/>
            <input type="submit" value="Update Profile"/>
        </form>
        );
    }

    render(){
        return (
        <div className="page">
            {this.state.error && (
                <ErrorNotice message={this.state.error} clearError={() => this.setState({error: undefined})} /> 
            )}
            {this.renderList()}
        </div>
        );
    }
}


export default Recruiter_register;
