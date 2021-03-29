import React from 'react';
import Axios from "axios";
import {Link} from 'react-router-dom';
import CheckBox_typeOfJob from './CheckBox_typeOfJob.js';
import Input_salary from './Input_salary.js';
import Dropdown_duration from './Dropdown_duration.js';
import {Collapse } from 'antd';
const {Panel} = Collapse

class ShowAllJobs extends React.Component {
    constructor(){
        super();
        this.state = {
            posts: [],
            appliedJobs: [],
            search :"",
            sortField: "salary",
            sortType: 'asc',
            filters_typeOfJob: [],
            filters_salary: [],
            filters_duration: undefined
        };
        this.changeSortField = this.changeSortField.bind(this);
        this.changeSortType = this.changeSortType.bind(this);
    }

    componentDidMount(){
        this.getPosts();
        this.getAppliedJobs();
    }

    async getAppliedJobs(){
        const token = localStorage.getItem("auth-token");
        const headers = {
            'x-auth-token': token,
            'Content-Type' : 'application/json'
        }
        const res = await Axios.get(
            "http://localhost:5000/users/get_applied_jobs/",
            {headers : headers},
        );
        this.setState({appliedJobs: res.data.applied_jobs}, () => {
            //console.log(this.state.appliedJobs);
            ;
        });
    }

    onchange = (e) => {
        this.setState({search : e.target.value});
    }

    async getPosts(){
        const token = localStorage.getItem("auth-token");
            const headers = {
                'x-auth-token': token,
                'Content-Type' : 'application/json'
        }

        const res = await Axios.get(
            "http://localhost:5000/users/display_all_jobs/",
            {headers : headers},
        );
        var i;
        var newArr= [];
        
        for(i=0; i<res.data.length; i++){
            var d = res.data[i].deadline;
            var newDate = new Date(d).getTime();
            var curr = new Date().getTime();
            // console.log(curr);
            // console.log(newDate);
            if(newDate > curr){
                newArr.push(res.data[i]);
            }
        }
        this.setState({ posts: newArr});
    }

    isFull(postId){
        const found = this.state.posts.findIndex(el => el._id === postId);
        if(this.state.posts[found].max_applications === this.state.posts[found].applicants_list.length)
            return true;
        else
            return false;
    }

    check(postId){
        const found = this.state.appliedJobs.some(el => el.id === postId);
        if(found){
            return true;
        }
        else{
            return false;
        }
    }

    alert_now(){
        alert("You cannot apply to more than 10 jobs!");
    }

    isTenReached(){
        if(this.state.appliedJobs.length === 10)
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

    renderList(){

        const {search, sortType, sortField, filters_typeOfJob, filters_salary, filters_duration} = this.state;

        const filteredOutput = this.state.posts.filter(post =>{
            return post.title.toLowerCase().indexOf(search.toLowerCase()) !== -1
        })

        var sorted = filteredOutput.sort( (a, b) => {
            const isReversed = (sortType === 'asc') ? 1 : -1;
            if(sortField === "salary")
                return isReversed * (a.salary - b.salary);
            if(sortField === "duration")
                return isReversed * (a.duration - b.duration);
            if(sortField === "rating")
                return isReversed * (a.rating - b.rating);
        });

        var filtered_data = sorted;

        if(filters_typeOfJob.length){
            filtered_data = sorted.filter(post=>
                filters_typeOfJob.includes(post.typeOfJob)
            );
            sorted = filtered_data;
        }
        if(filters_salary.length){

            if(filters_salary[0] === '' && filters_salary[1] === ''){
                filtered_data = sorted;
            }

            else if(filters_salary[0] >= 0 && filters_salary[1] >= 0){
                filtered_data = sorted.filter(post=>
                    post.salary >= filters_salary[0] && post.salary <= filters_salary[1] 
                );
            }
            else if(( filters_salary[0] === undefined || filters_salary[0] === '') && (filters_salary[1] !=='' && typeof filters_salary[1] !== 'undefined')){
                filtered_data = sorted.filter(post=>
                    post.salary <= filters_salary[1] 
                );
            }
            else if((filters_salary[1] === undefined || filters_salary[1] === '') && (filters_salary[0] !=='' && typeof filters_salary[0] !== 'undefined')){
                filtered_data = sorted.filter(post=>
                    post.salary >= filters_salary[0] 
                );
            }
            else{
                filtered_data = sorted;
            }
            sorted = filtered_data;
        }
        if(typeof filters_duration !== 'undefined'){
            filtered_data = sorted.filter(post=>
                post.duration < filters_duration 
            );
        }
        
        return filtered_data.map(post => {
            return (
                <tr>
                    <td>{post.title}</td>
                    <td>{post.typeOfJob}</td>
                    <td>{post.name}</td>
                    <td>{post.rating}</td>
                    <td>{post.salary}</td>
                    <td>{post.duration}</td>
                    <td>{post.deadline}</td>
                    <td>{post.max_applications}</td>
                    <td>{post.max_positions}</td>
                    <td>{post.applicants_list.length}</td>
                    {this.check(post._id) ? (
                        <>
                            <td><a className="delete_job_btn">Applied</a></td>
                        </>
                    ):
                    this.isFull(post._id) ? (
                        <>
                            <td><a className="edit_job_btn">Full</a></td>
                        </>
                    ):
                    this.isTenReached() ? (
                        <>
                            <td><a className="edit_profile_btn" onClick={this.alert_now}>Apply</a></td>
                        </>
                    ):
                    (
                        <>
                            <td><a className="edit_profile_btn" href={'/apply_job/'+post._id}>Apply</a></td>
                        </>
                    )
                    }       
                </tr>
            );
        });
    }

    handleFilters_typeOfJob = (filters) => {
        this.setState({filters_typeOfJob : filters});
    }
    handleFilters_salary = (filters) => {
        this.setState({filters_salary : filters});
    }
    handleFilters_duration = (filters) => {
        this.setState({filters_duration : filters});
    }

    render(){
        return (
        <div>
            <Link className="create_job_btn" to='/my_applications'>My Applications</Link>
            <div className="info">
            <input className="search" label="search" placeholder="Search..." onChange={this.onchange}/>
            <div className="sort">
                Sort:<select value={this.state.sortField} onChange={(e) => {this.changeSortField(e)}}>
                    <option>salary</option>
                    <option>duration</option>
                    <option>rating</option>
                </select>
                <select value={this.state.sortType} onChange={(e) => {this.changeSortType(e)}}>
                    <option>asc</option>
                    <option>desc</option>
                </select>
            </div>
            <div className="filters">
                <Collapse defaultActiveKey={['0']}>
                    <Panel header key="1">
                        <CheckBox_typeOfJob handleFilters={filters => this.handleFilters_typeOfJob(filters)}/>
                        <Input_salary handleFilters={filters => this.handleFilters_salary(filters)}/>
                        <Dropdown_duration handleFilters={filters => this.handleFilters_duration(filters)}/>
                    </Panel>
                </Collapse>
            </div>
            </div>
            {"\n"}
            <table className="new-table">
            <tr>
                <th>Title</th>
                <th>Type Of Job</th>
                <th>Recruiter Name</th>
                <th>Job rating</th>
                <th>Salary (per month)</th>
                <th>Duration</th>
                <th>Deadline</th>
                <td>Max_applications</td>
                <td>Max_positions</td>
                <td>No. of applicants</td>
                <th>Status</th>
            </tr>
            {this.renderList()}
            </table>
        </div>
        );
    }
}


export default ShowAllJobs;