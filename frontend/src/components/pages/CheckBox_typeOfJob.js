import React, {useState} from 'react';
import {Checkbox, Collapse } from 'antd';

const {Panel} = Collapse

const typeOfJob = [
    {
        "_id": 1,
        "name": "Full-time"
    },
    {
        "_id": 2,
        "name": "Part-time"
    },
    {
        "_id": 3,
        "name": "Work-from-home"
    }
]

export default function CheckBox_typeOfJob(props) {
    const [Checked, setChecked] = useState([]);

    const handleToggle = (value) => {

        const currentIndex = Checked.indexOf(value);
        const newChecked = [...Checked];

        if(currentIndex === -1){
            newChecked.push(value)
        }
        else{
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)
        props.handleFilters(newChecked);
    }

    const renderCheckboxLists = () => typeOfJob.map((value, index)  => (
        <React.Fragment key={index}>
            <Checkbox
                onChange={() => handleToggle(value.name)}
                type="checkbox"
                checked={Checked.indexOf(value.name) === -1 ? false : true}
            />
            <span>{value.name}</span>
        </React.Fragment>
    ))
    
    return (
        <div>
            {renderCheckboxLists()}
        </div>
    )
}
