import React from 'react';
import Axios from "axios";
import ErrorNotice from '../misc/ErrorNotice';

class Applicant_register extends React.Component {
    constructor(){
        super();
        this.state = {
            skills1 : undefined,
            skills2 : undefined,
            education1_name: undefined,
            education1_sy: undefined,
            education1_ey: undefined,
            education2_name: undefined,
            education2_sy: undefined,
            education2_ey: undefined,
            education3_name: undefined,
            education3_sy: undefined,
            education3_ey: undefined,
            education4_name: undefined,
            education4_sy: undefined,
            education4_ey: undefined,
            error: undefined,
        };
        this.changeSkills1 = this.changeSkills1.bind(this);
        this.changeSkills2 = this.changeSkills2.bind(this);
        this.changeEducation1Name = this.changeEducation1Name.bind(this);
        this.changeEducation1sy = this.changeEducation1sy.bind(this);
        this.changeEducation1ey = this.changeEducation1ey.bind(this);
        this.changeEducation2Name = this.changeEducation2Name.bind(this);
        this.changeEducation2sy = this.changeEducation2sy.bind(this);
        this.changeEducation2ey = this.changeEducation2ey.bind(this);
        this.changeEducation3Name = this.changeEducation3Name.bind(this);
        this.changeEducation3sy = this.changeEducation3sy.bind(this);
        this.changeEducation3ey = this.changeEducation3ey.bind(this);
        this.changeEducation4Name = this.changeEducation4Name.bind(this);
        this.changeEducation4sy = this.changeEducation4sy.bind(this);
        this.changeEducation4ey = this.changeEducation4ey.bind(this);
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
            "http://localhost:5000/users/applicant_profile", 
            {headers : headers}
        );

        this.setState({ skills2: res.data.skills });
        if(res.data.education[0]){
            this.setState({ education1_name: res.data.education[0].name });
            this.setState({ education1_sy: res.data.education[0].start_year });
            this.setState({ education1_ey: res.data.education[0].end_year });
        }
        if(res.data.education[1]){
            this.setState({ education2_name: res.data.education[1].name });
            this.setState({ education2_sy: res.data.education[1].start_year });
            this.setState({ education2_ey: res.data.education[1].end_year });
        }
        if(res.data.education[2]){
            this.setState({ education3_name: res.data.education[2].name });
            this.setState({ education3_sy: res.data.education[2].start_year });
            this.setState({ education3_ey: res.data.education[2].end_year });
        }
        if(res.data.education[3]){
            this.setState({ education4_name: res.data.education[3].name });
            this.setState({ education4_sy: res.data.education[3].start_year });
            this.setState({ education4_ey: res.data.education[3].end_year });
        }
    }

    submit_func = async(e) => {
        e.preventDefault();
        try{
            var skills;
            if(this.state.skills1 && this.state.skills2){
                skills = this.state.skills1.concat(this.state.skills2);
            }
            else if(this.state.skills1){
                skills = this.state.skills1;
            }
            else{
                skills = this.state.skills2;
            }
            // console.log(education1_name);
            const education = [{name: this.state.education1_name, start_year: this.state.education1_sy, end_year: this.state.education1_ey},
                {name: this.state.education2_name, start_year: this.state.education2_sy, end_year: this.state.education2_ey},
                {name: this.state.education3_name, start_year: this.state.education3_sy, end_year: this.state.education3_ey},
                {name: this.state.education4_name, start_year: this.state.education4_sy, end_year: this.state.education4_ey}
            ]

            const updateUser = { skills, education };
            
            const token = localStorage.getItem("auth-token");
            const headers = {
                'x-auth-token': token,
                'Content-Type' : 'application/json'
            }
            const x = await Axios.post(
                "http://localhost:5000/users/applicant_register", 
                {data: updateUser},
                {headers : headers},
            );

            //console.log(x);

            this.props.history.push("/display_all_jobs");
        }
            catch(err){
                //console.log(err);
                err.response.data.msg && this.setState({error: err.response.data.msg});
            }
    };

    changeSkills1(e){
        this.setState({ skills1: Array.from(e.target.selectedOptions, (item)=>item.value)}, () => {
            ;//console.log(this.state.contact_no);
        });
    }

    changeSkills2(e){
        this.setState({ skills2: Array.from(e.target.value.split(','))}, () => {
            ;//console.log(this.state.contact_no);
        });
    }

    changeEducation1Name(e){
        this.setState({ education1_name: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    changeEducation1sy(e){
        this.setState({ education1_sy: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    changeEducation1ey(e){
        this.setState({ education1_ey: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    changeEducation2Name(e){
        this.setState({ education2_name: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    changeEducation2sy(e){
        this.setState({ education2_sy: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    changeEducation2ey(e){
        this.setState({ education2_ey: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    changeEducation3Name(e){
        this.setState({ education3_name: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    changeEducation3sy(e){
        this.setState({ education3_sy: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    changeEducation3ey(e){
        this.setState({ education3_ey: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    changeEducation4Name(e){
        this.setState({ education4_name: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    changeEducation4sy(e){
        this.setState({ education4_sy: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    changeEducation4ey(e){
        this.setState({ education4_ey: e.target.value }, () => {
            ;//console.log(this.state.bio);
        });
    }

    renderList(){
        return (
        <form className="form" onSubmit={this.submit_func}>
            <label htmlFor="applicant_skills">Skills</label>
            <select id="applicant_register-skills" type="text" multiple onChange={(e) => {this.changeSkills1(e)}}>
            <option>Python</option>
            <option>Java</option>
            <option>JavaScript</option>
            <option>C/C++</option>
            </select>
            <label htmlFor="applicant_register-skills">Any Other Skills (Insert Comma separated values)</label>
            <input id="applicant_register-skills" type="text" value={this.state.skills2} onChange={(e) => {this.changeSkills2(e)}}/>
            <label htmlFor="applicant_register-education1">Education 1</label>
            Name:<input id="applicant_register-education1" type="text" value={this.state.education1_name} onChange={(e) => {this.changeEducation1Name(e)}}/>
            Start year:<input id="applicant_register-education1" type="number" value={this.state.education1_sy} onChange={(e) => {this.changeEducation1sy(e)}}/>
            End year:<input id="applicant_register-education1" type="number" value={this.state.education1_ey} onChange={(e) => {this.changeEducation1ey(e)}}/>
            <label htmlFor="applicant_register-education2">Education 2</label>
            Name:<input id="applicant_register-education2" type="text" value={this.state.education2_name} onChange={(e) => {this.changeEducation2Name(e)}}/>
            Start year:<input id="applicant_register-education2" type="number" value={this.state.education2_sy} onChange={(e) => {this.changeEducation2sy(e)}}/>
            End year:<input id="applicant_register-education2" type="number" value={this.state.education2_ey} onChange={(e) => {this.changeEducation2ey(e)}}/>
            <label htmlFor="applicant_register-education3">Education 3</label>
            Name:<input id="applicant_register-education3" type="text" value={this.state.education3_name} onChange={(e) => {this.changeEducation3Name(e)}}/>
            Start year:<input id="applicant_register-education3" type="number" value={this.state.education3_sy} onChange={(e) => {this.changeEducation3sy(e)}}/>
            End year:<input id="applicant_register-education3" type="number" value={this.state.education3_ey} onChange={(e) => {this.changeEducation3ey(e)}}/>
            <label htmlFor="applicant_register-education4">Education 4</label>
            Name:<input id="applicant_register-education4" type="text" value={this.state.education4_name} onChange={(e) => {this.changeEducation4Name(e)}}/>
            Start year:<input id="applicant_register-education4" type="number" value={this.state.education4_sy} onChange={(e) => {this.changeEducation4sy(e)}}/>
            End year:<input id="applicant_register-education4" type="number" value={this.state.education4_ey} onChange={(e) => {this.changeEducation4ey(e)}}/>
            <input type="submit" value="Update" />
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


export default Applicant_register;
