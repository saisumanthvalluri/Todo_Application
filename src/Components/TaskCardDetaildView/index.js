import Modal from 'react-modal';
import {Component} from 'react'
import { customStylesForTaskCardView } from '../../AppConstants/constants';
import {IoMdClose} from 'react-icons/io'
import "./index.css"
class TaskCardDetaildView extends Component {
    state = {
        modalStatus: false,
    }

    onOpenModal = () => {
        this.setState({modalStatus: true})
    }

    onCloseModel = () => {
        this.setState({modalStatus: false})
    }

    render() {
        const {taskDetails} = this.props
        const {taskdetails} = taskDetails
        // console.log(taskDetails)
        return(
            <div className='detaild-view'>
                <button className="button" onClick={this.onOpenModal}><span>Show more </span></button>
                <Modal
                    isOpen={this.state.modalStatus}
                    style={customStylesForTaskCardView}
                    onRequestClose={this.state.modalStatus}>
                    <div className='detaild-view-modal'>
                        <IoMdClose title='close' type='button' className='close-icon' onClick={this.onCloseModel} />
                        <h3>{taskdetails}</h3>
                        <h3>!! Detailed view under developing in progress! please try other functionalities :)</h3>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default TaskCardDetaildView