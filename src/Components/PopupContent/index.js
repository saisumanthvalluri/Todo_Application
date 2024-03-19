import { Component } from "react";
import newTaskContext from "../../Context/newTaskContext";
import {BsExclamationCircle, BsCheckCircle} from 'react-icons/bs'
import {BiErrorCircle} from 'react-icons/bi'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './index.css'

class PopupContent extends Component {
    state = {
        msg: "",
        startDate: null,
    }
    render() {
        return(
            <newTaskContext.Consumer>
                {value => {
                    const {
                        taskName, 
                        changeTask, 
                        taskDetails, 
                        changeTaskDetails, 
                        priority, 
                        changePriority, 
                        dueDate, 
                        changeDueDate,
                        createNewTask,
                        allLabels,
                    } = value

                    const changeTaskName = (e) => {
                        changeTask(e.target.value)
                    }

                    const onChangeTaskDetails = (e) => {
                        changeTaskDetails(e.target.value)
                    }

                    const onChangePriority = (e) => {
                        changePriority(e.target.value)
                    }

                    const onChangeDueDate = (e) => {
                        changeDueDate(e)
                    }

                    const emptyMsg = () => {
                        this.setState({msg: ""})
                    }

                    const onCreateNewTask = () => {
                        if (taskName === "" || taskDetails === "" || priority === "" || dueDate === "") {
                            
                            this.setState({msg : "All fields are mandatory!"})
                            setTimeout(function(){
                                emptyMsg()
                            }, 5000)
                        } else {
                            createNewTask()
                            this.setState({msg: "Task Added Successfully!"})
                            setTimeout(function(){
                                emptyMsg()
                            }, 3000)
                        }
                    }
                    
                    const msgClassName = this.state.msg === "All fields are mandatory!" ? "msg error" : "msg success"
                    // console.log(allLabels)
                    return(
                        <form className="new-task-from" autoComplete='off'>
                            <label 
                                className="form-label"
                                htmlFor="taskName">
                                Task Name<sup className="star">*</sup>
                            </label>
                            <input
                                value={taskName}
                                onChange={changeTaskName}
                                id="taskName"
                                type="text"
                                placeholder="Task Name"
                                className="form-input" />
                            <label
                                className="form-label"
                                htmlFor="taskDetails">
                                    Task Details<sup className="star">*</sup>
                            </label>
                            <textarea 
                                className="form-input text-area" 
                                value={taskDetails} 
                                id="taskDetails" 
                                onChange={onChangeTaskDetails} 
                                rows="4" 
                                cols="50" 
                                placeholder="Write some key points...">
                            </textarea>
                            <label 
                                className="form-label" 
                                htmlFor="priority">
                                    Priority<sup className="star">*</sup>
                            </label>
                            <select 
                                id="priority" 
                                className="form-input" 
                                disabled={allLabels.length === 0}
                                onChange={onChangePriority}>
                                    <option value="" disabled selected hidden>Choose a Priority</option>
                                    {allLabels.map((e) => (
                                        <option value={e.labelText} id={e.id} className="priority-opt" >
                                            {e.labelText}
                                        </option> 
                                    ))}
                            </select>
                            {allLabels.length === 0 ? (
                                <div className="msg-box" style={{marginTop: "0px"}}>
                                    <BiErrorCircle style={{fontSize: "25px", color: "red", marginRight: "8px"}} />
                                    <p style={{fontSize: "16px", color: "red"}}>No labels available. Please create labels first</p>
                                </div>
                            ) : null}
                            <label 
                                className="form-label" 
                                htmlFor="dueDate">
                                    Due Date<sup className="star">*</sup>
                            </label>
                            <DatePicker
                                selected={dueDate}
                                onChange={(date) => onChangeDueDate(date)}
                                minDate={new Date()}
                                // maxDate={addMonths(new Date(), 5)}
                                showDisabledMonthNavigation
                                fixedHeight
                                showPopperArrow={false}
                                todayButton="Today"
                                placeholderText="Click to select a date"
                                className="date-picker"
                            />
                            <button 
                                className="create-task-btn" 
                                type="button" 
                                onClick={onCreateNewTask}>
                                    Add Task
                            </button>
                            {this.state.msg !== "" ? (
                                <div className="msg-box">
                                    {this.state.msg === "All fields are mandatory!" ? (
                                        <BsExclamationCircle className="msg-info-logo" style={{color: "red"}} />
                                    ): (
                                        <BsCheckCircle className="msg-info-logo" style={{color: "green"}} />
                                    )}
                                    
                                    <p className={msgClassName}>{this.state.msg}</p>  
                                </div> 
                            ) : null}
                        </form>
                    )
                }}
            
            </newTaskContext.Consumer>
        )
    }
}

export default PopupContent