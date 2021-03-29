import React, {useState, useContext} from 'react';

class Input_salary extends React.Component {

    state = {
        min_salary: undefined,
        max_salary: undefined
    }

    handle_change_min = async(e) =>{
        this.setState({min_salary: e.target.value}, 
            function() {
                this.props.handleFilters([this.state.min_salary, this.state.max_salary])
            }.bind(this)
        );
    }

    handle_change_max = async(e) =>{
        this.setState({max_salary: e.target.value}, 
            function() {
                this.props.handleFilters([this.state.min_salary, this.state.max_salary])
            }.bind(this)
        );
    }

    render(){
        return (
            <div>
                <input id="min_salary" type="number" placeholder="Min salary" onChange={(e) => this.handle_change_min(e)}/>
                <input id="max_salary" type="number" placeholder="Max salary" onChange={(e) => this.handle_change_max(e)}/>
            </div>
        )
    }
}

export default Input_salary;