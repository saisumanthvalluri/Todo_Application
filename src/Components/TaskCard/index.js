import './index.css'
import {GoTag} from 'react-icons/go'
import TaskCardDetaildView from "../TaskCardDetaildView"
// import Modal from 'react-modal';
import {MdOutlineDelete, MdOutlineRestore} from 'react-icons/md'

const TaskCard = (props) => {
    const {taskData, completedTaskStatus, deleteTask, deleteUndoTask, undoCompleteTaskStatus} = props
    const {id, taskname, priority, createdat, isCompleted, isDeleted} = taskData
    const deleteBtnClassName = isCompleted ? "delete-btn disable" : "delete-btn"
    const taskCardClassName = isCompleted ? "task-card completed" : "task-card"
    const inputEleStyle = isDeleted ? "not-allowed" : ""
    let taskStatus
    if (isCompleted && !isDeleted) {
        taskStatus = "mark as incompleted"
    } else if (!isCompleted && isDeleted) {
        taskStatus = "you can not change status"
    } else {
        taskStatus = "mark as completed"
    }

    const onToggleTaskStatus = () => {
        completedTaskStatus(id)
    }
    
    const onDelTask = () => {
        deleteTask(id)
    }

    const onDelUndoTask = () => {
        deleteUndoTask(id)
    }

    const onUndoCompTask = () => {
        undoCompleteTaskStatus(id)
    }

    return(
        <li className={taskCardClassName} key={id}>
            <input
                className={`checkbox-ele ${inputEleStyle}`}
                type="checkbox"
                id="checkbox"
                onChange={!isCompleted ? onToggleTaskStatus : onUndoCompTask}
                checked={isCompleted}
                title={taskStatus}
                disabled={isDeleted} />
            <div className='task-content'>
                <h5 className='created-at'>{createdat}</h5>
                <h3 className='task-name'>{taskname}</h3>
                <div className='priority-box'>
                    <GoTag className='tag-icon' />
                    <p className='priority'>{priority}</p>
                </div>
                <TaskCardDetaildView taskDetails={taskData} />
            </div>
            {isCompleted ? null : (
                <div
                    className={`${deleteBtnClassName} tooltip-del`}
                    type="button"
                    // onClick={onDelTask}
                    disabled={isCompleted}>
                        {isDeleted ? (<MdOutlineRestore onClick={onDelUndoTask} />) : (<MdOutlineDelete onClick={onDelTask} />)}
                        <span className="tooltiptext-del">{isDeleted ? "Restore" : "Delete"}</span>
                </div>
            )}
        </li>
    )
}

export default TaskCard 