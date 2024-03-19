import { Component } from "react";
import { BsExclamationCircle, BsCheckCircle, BsQuestionCircle } from 'react-icons/bs'
import { BallTriangle } from  'react-loader-spinner'
import { IoMdClose } from 'react-icons/io'
import { TabsList } from "../../AppConstants/constants";
import { MdOutlineNewLabel, MdOutlineLabelOff } from 'react-icons/md'
import Popup from 'reactjs-popup';
import PopupContent from '../PopupContent'
import TabItem from "../TabItem";
import LabelItem from "../LabelItem";
import newTaskContext from "../../Context/newTaskContext";
import 'reactjs-popup/dist/index.css';
import './index.css'
class Sidebar extends Component {
    state = {
        activeTabId: "TODO",
        msg: "",
        allLabels: []
    }

    componentDidMount() {
        const activeTab = localStorage.getItem('activeTab')
        const tab = activeTab === null ? "TODO" : activeTab
        this.setState({activeTabId: tab})
    }

    changeActiveTab = (id) => {
        this.setState({activeTabId: id})
    }

    renderNoLabelsView = () => (
        <div className="no-lables-box">
            <MdOutlineLabelOff className="no-lables-icon" />
            <p className="no-labels-text">Oops... No Labels!</p>
        </div>
    )

    renderLoader = () => (
        <div className="loader-container">
            <BallTriangle 
                height={100}
                width={100}
                radius={4}
                color="#1ac2d9"
                ariaLabel="ball-triangle-loading"
                wrapperClass={{}}
                wrapperStyle=""
                visible={true}
            />
        </div>
    )

    render() {
        const {pendingTasks, apiStatus} = this.props
        const {activeTabId} = this.state
        return(
            <newTaskContext.Consumer>
                {value => {
                    const {createNewLabel, changeLabelInput, changeLabelColor,labelName, labelColor, allLabels} = value

                    const onChangeLabelInput = (e) => {
                        changeLabelInput(e.target.value)
                    }

                    const onChangeLabelColor = (e) => {
                        changeLabelColor(e.target.value)
                    }

                    const onCreateNewLabel = () => {
                        if (labelName === "" || labelColor === "#c731de") {
                            this.setState({msg : "All fields are mandatory!"})
                        } else {
                            createNewLabel()
                            this.setState({msg: "Label Added Successfully!"})
                        }
                    }

                    const onClearMsg = () => {
                        this.setState({msg: ""})
                    }

                    const renderLabels = () => (
                        allLabels.length !== 0 ? (
                            <ul className="labels-box">
                                {allLabels.map((e) => (
                                    <LabelItem 
                                        key={e.id}
                                        labelDetails={e}
                                    />
                                ))}
                            </ul>) 
                        : this.renderNoLabelsView()                  
                    )

                    const msgClassName = this.state.msg === "All fields are mandatory!" ? "msg error" : "msg success"

                    return(
                        <div className="sidebar-container">
                            <Popup
                                className="pop-up"
                                modal
                                trigger={ <button className="new-task-btn" title="create new task">+ New Task</button> }>
                                    {close => (
                                        <div className="modal-container">
                                            <h2 className="modal-title">
                                                Add New Task
                                            </h2>
                                            <hr className="hr-rule" />
                                            <div className="popup-content-box">
                                                <img 
                                                    src="https://res.cloudinary.com/duzlefgz6/image/upload/v1670418322/task_lbqijz.png" 
                                                    alt="create task" 
                                                    className="create-task-img" />
                                                <PopupContent />
                                            </div>
                                            <button
                                                className="modal-close-btn"
                                                onClick={() => {
                                                close();
                                                }}>
                                                close
                                            </button>
                                        </div>
                                    )}
                            </Popup>
                            <ul className="tabs-box">
                                {TabsList.map((e) => (
                                    <TabItem 
                                        key={e.id}
                                        tabDetails={e}
                                        changeActiveTab={this.changeActiveTab}
                                        isActive={activeTabId === e.id}
                                        pendingTasks={pendingTasks}
                                    />
                                ))}
                            </ul>
                            <div className="labels-heading-question-logo-box">
                                <h3 className="lables-heading">Lables</h3>
                                <span className="span" data-hover="Hello"></span>
                                <BsQuestionCircle className="question-logo" />
                            </div>
                            <Popup
                                className="pop-up"
                                position="right center"
                                trigger={
                                    <button className="add-label-box" title="add new label">
                                        <MdOutlineNewLabel style={{fontSize: "30"}} />
                                        <h4 onClick={onClearMsg}>Add Label</h4>
                                    </button>
                                }>
                                    {close => (
                                        <div className="modal-container2">
                                        <IoMdClose className="close-icon" onClick={() => close()} />
                                            <form className="addlabel-color-form" autoComplete='off'>
                                                <label 
                                                    className="form-label2"
                                                    htmlFor="LabelName">
                                                        Label Name<sup className="star">*</sup>
                                                </label>
                                                <input
                                                    value={labelName}
                                                    onChange={onChangeLabelInput}
                                                    id="LabelName"
                                                    type="text"
                                                    placeholder="Label Name"
                                                    className="form-input2" 
                                                    maxLength={15}
                                                /> 
                                                <label 
                                                    className="form-label2"
                                                    htmlFor="LabelColor">
                                                        Label Color<sup className="star">*</sup>
                                                </label>
                                                <input
                                                    value={labelColor}
                                                    onChange={onChangeLabelColor}
                                                    id="LabelColor"
                                                    type="color"
                                                    placeholder="Label Color"
                                                    className="form-input2 color" 
                                                /> 
                                                <button
                                                    className="add-label-btn"
                                                    type="button"
                                                    onClick={onCreateNewLabel}>
                                                        Add Label
                                                </button>
                                                {this.state.msg !== "" ? (
                                                    <div className="msg-box">
                                                        {this.state.msg === "All fields are mandatory!" ? (
                                                            <BsExclamationCircle className="msg-info-logo" style={{color: "red"}} />
                                                        ): (
                                                            <BsCheckCircle className="msg-info-logo" style={{color: "green"}} />
                                                        )}
                                                        <p className={msgClassName} style={{width:"100%", fontSize:"14px"}}>
                                                            {this.state.msg}
                                                        </p>
                                                    </div> 
                                                ) : null}
                                            </form>
                                        </div>
                                    )}
                            </Popup>
                            {apiStatus === 'IN_PROGRESS' ? this.renderLoader() : renderLabels()}
                        </div>
                    )
                }}
            </newTaskContext.Consumer>
        )
    }
}

export default Sidebar