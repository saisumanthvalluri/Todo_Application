import './index.css'
import {BsExclamationLg} from 'react-icons/bs'
import newTaskContext from '../../Context/newTaskContext'

const TabItem = props => {
    const {tabDetails, changeActiveTab, isActive, pendingTasks} = props
    const {id, tabText, tabLogo} = tabDetails
    const tabClassName = isActive ? "tab-btn active" : "tab-btn"

    return (
        <newTaskContext.Consumer>
            {value => {
                const {changeTab} = value
                
                const onChangeActiveTab = () => {
                    changeActiveTab(id)
                    changeTab(id)
                }
                return(
                    <li className='tab-item' key={id}>
                        <button className={tabClassName} type='button' onClick={onChangeActiveTab}>
                            <div className='btn-content-box'>
                                {tabLogo}
                                {tabText}
                                {id === "PENDING" && pendingTasks.length > 0 ? (<BsExclamationLg fontSize={25} color="#c91249" />) : null}
                            </div>
                        </button>
                    </li>
                )
            }}
        </newTaskContext.Consumer>
    )
}

export default TabItem