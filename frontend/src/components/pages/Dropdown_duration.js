import React, {useState, useContext} from 'react';

class Dropdown_duration extends React.Component {

    state = {
        duration: undefined
    }

    handle_change = async(e) =>{
        this.setState({duration: e.target.value}, 
            function() {
                this.props.handleFilters([this.state.duration])
            }.bind(this)
        );
    }

    render(){
        return (
            <div>
                <select onChange={(e) => this.handle_change(e)}>
                    <option style={{display: 'none'}}>--Duration--</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                </select>
            </div>
        )
    }
}

export default Dropdown_duration;