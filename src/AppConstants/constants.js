// import {GoTag} from 'react-icons/go'
// import {v4 as uuidv4} from 'uuid'
import {BsExclamationCircle, BsCheckAll, BsThreeDots} from 'react-icons/bs'
import {RiDeleteBinLine} from 'react-icons/ri'
import {RxCountdownTimer} from 'react-icons/rx'

// export const labelsList = [
//     {id: uuidv4(), labelText: "High", labelColor: "#ed328f", createdat: new Date().toLocaleString()},
//     {id: uuidv4(), labelText: "Medium", labelColor: "#e7f551", createdat: new Date().toLocaleString()},
//     {id: uuidv4(), labelText: "Low", labelColor: "#42c756", createdat: new Date().toLocaleString()},
// ]

export const TabsList = [
    {id: "TODO", tabText: "Todo Tasks", tabLogo: <BsExclamationCircle className="tab-icons" />},
    {id: "COMPLETE", tabText: "Completed Tasks", tabLogo: <BsCheckAll className="tab-icons" />},
    {id: "DELETE", tabText: "Deleted Tasks", tabLogo: <RiDeleteBinLine className="tab-icons" />},
    {id: "DUE", tabText: "Due Soon Tasks", tabLogo: <BsThreeDots className="tab-icons" />},
    {id: "PENDING", tabText: "Pending Tasks", tabLogo: <RxCountdownTimer className="tab-icons" />},
]

export const customStylesForLabelEdit = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      width: "200px",
      height: "180px",
      backgroundColor: "antiquewhite",
      display: "flex",
      flexDirection: "column",
      padding: "10px",
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
  };

export const customStylesForTaskCardView = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      width: '700px',
      height: '500px',
      transform: 'translate(-50%, -50%)',
      // backgroundColor: "#eecef5",
      opacity: 0.8,
      display: "flex",
      flexDirection: "column",
      padding: "10px",
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
  };

  export const customStylesForDeleteDialog = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      width: '320px',
      height: '140px',
      transform: 'translate(-50%, -50%)',
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      padding: "8px",
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
  };

  export const apiConstants = {
    inProgress: 'IN_PROGRESS',
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE'
}