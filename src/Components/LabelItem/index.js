import {Component} from 'react'
import {Labelitem, Logo} from './styledComponents.js'
import Modal from 'react-modal';
import newTaskContext from '../../Context/newTaskContext.js'
// import {BsCheckCircle} from 'react-icons/bs'
import {GoTag} from 'react-icons/go'
import {BiEdit} from 'react-icons/bi'
import {MdOutlineDelete} from 'react-icons/md'
import {IoMdClose} from 'react-icons/io'
import './index.css'
import {customStylesForLabelEdit, customStylesForDeleteDialog} from '../../AppConstants/constants'
class LabelItem extends Component {

    state={
        msg: "",
        editLabelModel: false,
        deleteLabelModel: false,
    }

    render() {
        const {labelDetails} = this.props
        const {labelText, id, labelColor} = labelDetails
        const lableLogo = <GoTag />

        return(
            <newTaskContext.Consumer>
                {value => {
                    const {
                        deleteLabel,
                        editLabel,
                        editLabelText,
                        setEditableLabelData,
                        editLabelColor,
                        editedLabelText,
                        editedLabelColor,
                        // allTasks
                    } = value

                    const onOpenDeleteLabelModel = () => {
                        this.setState({deleteLabelModel: true})
                    }

                    const onCloseDeleteLabelModel = () => {
                        this.setState({deleteLabelModel: false})
                    }
                    
                    const onDeleteLabel = () => {
                        deleteLabel(id)
                    }

                    const onEditLabelText = (e) => {
                        editLabelText(e.target.value)
                    }

                    const onEditLabelColor = (e) => {
                        editLabelColor(e.target.value)
                    }

                    const onEditLabel = () => {
                        // let counter = 0
                        // for (let task of allTasks) {
                        //     if (task.priority === labelText) {
                        //         counter += 1
                        //     }
                        // }
                        // if (counter === 0) {
                        //     this.setState({msg: "Updated Successfully!"})
                        // }
                        editLabel(id)
                        setTimeout( function() {
                            onClose()
                        }, 500)
                    }

                    const onOpen = () => {
                        // let counter = 0
                        // for (let task of allTasks) {
                        //     if (task.priority === labelText) {
                        //         counter += 1
                        //     }
                        // }

                        // if (counter === 0) {
                            this.setState({msg: ""})
                            this.setState({editLabelModel: true})
                            setEditableLabelData(labelDetails)
                        // } else {
                            // alert(`you can't Update ${labelText} label as it is exists in Tasks!`)
                        // }
                    }

                    const onClose = () => {
                        this.setState({editLabelModel: false})
                    }
                    return(
                        <Labelitem className='label-item' key={id}>
                            <div className='logo-label-box'>
                                <div className='box'>
                                    <Logo color={labelColor}>{lableLogo}</Logo>
                                    {labelText}
                                </div>
                                <div className='edit-box'>
                                    <BiEdit title='edit' className='edit-icon' onClick={onOpen} />

                                    {/* label edit modal starts */}
                                    <Modal
                                        isOpen={this.state.editLabelModel}
                                        style={customStylesForLabelEdit}
                                        onRequestClose={this.state.editLabelModel}
                                        ariaHideApp={false}
                                        >
                                        <div className='edit-container'>
                                            <IoMdClose onClick={onClose} className="close-icon" />
                                            <form className="editlabel-color-form" autoComplete='off'>
                                                <label 
                                                    className="form-label3"
                                                    htmlFor="LabelName">
                                                        Label Name
                                                </label>
                                                <input
                                                    value={editedLabelText}
                                                    onChange={onEditLabelText}
                                                    id="LabelName"
                                                    type="text"
                                                    placeholder="Label Name"
                                                    className="form-input3" 
                                                /> 
                                                <div className='color-box'>
                                                    <label 
                                                        className="form-label3"
                                                        htmlFor="LabelColor">
                                                            Label Color
                                                    </label>
                                                    <input
                                                        value={editedLabelColor}
                                                        onChange={onEditLabelColor}
                                                        id="LabelColor"
                                                        type="color"
                                                        placeholder="Label Color"
                                                        className="form-input3 color2" 
                                                    /> 
                                                </div>
                                                <button
                                                    className="add-label-btn"
                                                    type="button"
                                                    onClick={onEditLabel}>
                                                        Update Label
                                                </button>
                                                {/* {this.state.msg !== "" ? (
                                                    <div className="msg-box">
                                                        <BsCheckCircle className="msg-info-logo" style={{color: "green"}} />
                                                        <p className="msg" style={{width:"100%",fontSize:"14px",color:"green"}}>
                                                            {this.state.msg}
                                                        </p>  
                                                    </div> 
                                                ) : null} */}
                                            </form>
                                        </div>
                                    </Modal>
                                    {/* label edit modal ends */}

                                    {/* label delete modal starts */}
                                    <MdOutlineDelete title='delete' className='edit-icon' onClick={onOpenDeleteLabelModel} />
                                    <Modal
                                        isOpen={this.state.deleteLabelModel}
                                        style={customStylesForDeleteDialog}
                                        onRequestClose={this.state.deleteLabelModel}
                                        ariaHideApp={false}
                                        >
                                        <div>
                                            <h3 className="are-you-sure-text">Are you Sure! You want to Delete?</h3>
                                            <div className='buttons-box'>
                                                <button className='btn cancel' onClick={onCloseDeleteLabelModel}>Cancel</button>
                                                <button className='btn delete' onClick={onDeleteLabel}>Delete</button>
                                            </div>
                                        </div>
                                    </Modal>
                                    {/* label delete modal ends */}
                                </div>
                            </div>
                        </Labelitem>
                    )
                }}
            </newTaskContext.Consumer>
        )
    }
}

export default LabelItem