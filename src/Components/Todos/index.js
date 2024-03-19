import * as React from 'react';
import { Component } from 'react'
import { Navigate } from 'react-router-dom';
import { GoSearch } from 'react-icons/go'
import { FiMessageSquare } from 'react-icons/fi'
import { AiOutlineBell } from 'react-icons/ai'
import { IoMdClose } from 'react-icons/io'
import { CgProfile } from 'react-icons/cg'
import { RiLogoutCircleRLine } from 'react-icons/ri'
import { BsInfoCircle, BsExclamationCircle } from 'react-icons/bs'
import { MdArrowDropUp } from 'react-icons/md'
import { signOut } from 'firebase/auth';
import { collection, updateDoc, doc, getDoc, addDoc, deleteDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
// import { ref, getDownloadURL } from "firebase/storage";
import { auth, db } from '../../Firebase-config';
import { BallTriangle } from 'react-loader-spinner'
import { apiConstants } from '../../AppConstants/constants'
import { Modal, Box } from '@mui/material';
// import { motion } from 'framer-motion';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Cookies from 'js-cookie';
import Profile from '../Profile';
import Badge from '@mui/material/Badge';
import Popup from 'reactjs-popup';
import Sidebar from '../Sidebar'
import newTaskContext from "../../Context/newTaskContext"
import TaskCard from '../TaskCard'
import NotePad from '../NotePad'
import './index.css'

class Todos extends Component {
    state = {
        taskName: "",
        taskDetails: "",
        priority: "",
        dueDate: "",
        allTasks: [],
        searchInput: "",
        activeTab: "TODO",
        category : "All",
        labelName: "",
        labelColor: "#c731de",
        editedLabelText: "",
        editedLabelColor: "",
        allLabels: [],
        userData: {},
        notesCount: 0,
        apiStatus: apiConstants.initial,
        profileModalOpen: false,
        logoutDialogOpen: false,
        snackbarData: {
           open: false,
           msg: '',
           type: ''
        },
    }

    componentDidMount() {
        // getting userInfo from localstorage
        const userInfo = JSON.parse(localStorage.getItem('user_info'))
        if (userInfo !== null) {
            // getting current user, labels, tasks, user_image from firebase
            this.getCurrentUserData(userInfo)
        } else {
            this.setState({apiStatus: apiConstants.failure})
            // return <Navigate to='/login' replace={true} />
        }

        // getting activeTab from localstorage and adding to state
        this.getActiveTab()
    }

    getActiveTab = () => {
        const activeTab = localStorage.getItem('activeTab')
        const tab = activeTab === null ? "TODO" : activeTab
        this.setState({activeTab: tab})
    }

    getCurrentUserData = (userInfo) => {
        this.setState({apiStatus: apiConstants.inProgress})

        // getting realtime updates on current user from firebase
        const unSubUserData = onSnapshot(collection(db, "users"), (snapshot) => {
            snapshot.docs.forEach((doc) => {
                if (doc.id === userInfo.userId) {
                    this.setState({userData: {...doc.data(), userId: doc.id}})
                }
            })
        })

        // getting realtime updates on current user's tasks
        const unSubTasks = onSnapshot(collection(db, `users/${userInfo.userId}/user-tasks`), (snapshot) => {
            let list = []
            snapshot.docs.forEach((doc) => {
                list.push({...doc.data(), id: doc.id})
            })
            this.setState({allTasks: [...list]})
        })

        // getting realtime updates on current user's labels
        const unSubLabels = onSnapshot(collection(db, `users/${userInfo.userId}/user-labels`), (snapshot) => {
            let list = []
            snapshot.docs.forEach((doc) => {
                list.push({...doc.data(), id: doc.id})
            })
            this.setState({allLabels: list.sort((a,b) => (a.date - b.date))})
        })

        // getting realtime updated on notes count
        const unSubNotes = onSnapshot(collection(db, `users/${userInfo.userId}/user-notes`), (snapshot) => {
            let list = []
            snapshot.docs.forEach((doc) => {
                list.push(doc)
            })
            this.setState({notesCount: list?.length})
        })

        // getting all users from firebase and filtering for current user data
        // const userCollectionRef = collection(db, "users")
        // const data = await getDocs(userCollectionRef)
        // const pureData = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        // const currUser = pureData.filter(e => (e.id === userInfo.userId))
        // this.setState({userData: {
        //     ...userInfo,
        //     name : currUser[0]?.name,
        //     mobileNo: currUser[0]?.mobile_no,
        //     email: currUser[0]?.email,
        //     userImageUrl: currUser[0]?.userImageUrl
        // }})

        // getting current user labels from firebase
        // const labelsColloctionRef = collection(db, `users/${userInfo.userId}/user-labels`)
        // const userLabelsData = await getDocs(labelsColloctionRef)
        // const pureUserLabelData = userLabelsData.docs.map((doc) => ({...doc.data(), id: doc.id}))
        // this.setState({allLabels: pureUserLabelData.sort((a,b) => (a.date - b.date))})

        // getting all current user's tasks from the firebase
        // const userTasksCollectionRef = collection(db, `users/${userInfo.userId}/user-tasks`)
        // const userTasksData = await getDocs(userTasksCollectionRef)
        // const pureDataUserTasksData = userTasksData.docs.map((doc) => ({...doc.data(), id: doc.id}))
        // this.setState({allTasks: [...pureDataUserTasksData]})

        // getting current user's notes count from firebase
        // const userNotesCollectionRef = collection(db, `users/${currUser[0]?.id}/user-notes`)
        // const notesData = await getDocs(userNotesCollectionRef)
        // const pureUserNoteData = notesData.docs.map((doc) => ({...doc.data(), id: doc.id}))
        // this.setState({notesCount: pureUserNoteData?.length})

        // getting current user image from firebase storage
        // const starsRef = ref(storage, `user-avatars/${userInfo.userId}`);
        // getDownloadURL(starsRef)
        //     .then((url) => {
        //         this.setState(prev => ({userData: {...prev.userData, userImgUrl: url}}))
        //     })


        // getting all images and filtering for current user image with userId from firebase
        // listAll(starsRef).then((res) => {
        //     res.items.forEach((item) => {
        //         if (item.name === userInfo.userId) {
        //             getDownloadURL(item).then((url) => {
        //                 this.setState(prev => ({userData: {...prev.userData, userImgUrl: url}}))
        //             })
        //         }
        //     })
        // })

        setTimeout(() => {
            this.setState({apiStatus: apiConstants.success})
        }, 1100)
        
        return () => {
            unSubNotes()
            unSubUserData()
            unSubLabels()
            unSubTasks()
        }
    }
    
    changeTask = (val) => {
        this.setState({taskName: val})
    }

    changeTaskDetails = (val) => {
        this.setState({taskDetails: val})
    }

    changePriority = (val) => {
        this.setState({priority: val})
    }

    changeDueDate = (val) => {
        this.setState({dueDate: val})
    }

    createNewTask = () => {
        const {taskName, taskDetails, priority, dueDate, userData} = this.state
        const shortDueDate = dueDate.toLocaleDateString('en-GB').split('/').reverse().join('-')

        // creating new task with state for quick action in UI
        const newTask = {
            userId: userData.userId,
            taskname: taskName,
            taskdetails: taskDetails,
            priority,
            duedate: shortDueDate,
            createdat: new Date().toLocaleString(),
            duedateobj: dueDate,
            isCompleted: false,
            isDeleted: false,
            timeStamp: serverTimestamp()
        }
        this.setState(prev => ({
            // allTasks: [...prev.allTasks, newTask],
            taskName: "", taskDetails: "", priority: "", dueDate: "",
        }))
        this.handleOpenSnackbar(true, `{${taskName}} task added successfully!`, 'success')

        // creating new task with firebase
        const addNewTask = async () => {
            const labelsColloctionRef = collection(db, `users/${userData.userId}/user-tasks`)
            await addDoc(labelsColloctionRef, newTask)
        }
        addNewTask()
    }

    changeTab = (id) => {
        this.setState({activeTab: id})
        localStorage.setItem("activeTab", id)
    }

    completedTaskStatus = (id) => {
        const {userData} = this.state

        // updating task as completed with Firebase
        const update = async () => {
            const docRef = doc(db, `users/${userData.userId}/user-tasks`, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                await updateDoc(docRef, {isCompleted: true})
                this.handleOpenSnackbar(true, 'task added to completed list!', 'success')
              } else {
                this.handleOpenSnackbar(true, `No such document with ${id} in userId ${userData.userId}`, 'error')
              }
        }
        update()
    }

    undoCompleteTaskStatus = async (id) => {
        const {userData} = this.state
        // updating task as incompleted with Firebase
        const update = async () => {
            const docRef = doc(db, `users/${userData.userId}/user-tasks`, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                await updateDoc(docRef, {isCompleted: false})
                this.handleOpenSnackbar(true, 'task removed from completed list!', 'info')
              } else {
                this.handleOpenSnackbar(true, `No such document with ${id} in userId ${userData.userId}`, 'error')
              }
        }
        update()
    }

    getTabName = (activeTab) => {
        const completedTasks = this.getCompletedTasks()
        const inCompletedTasks = this.getIncompletedTasks()
        const deletedTasks = this.getDeletedTasks()
        const dueSoonTasks = this.getDueSoonTasks()
        const pendingTasks = this.getPendingTasks()
        const {allTasks} = this.state
        if (activeTab === "TODO") {
            return `Todo Tasks (${inCompletedTasks.length} of ${allTasks.length})`
        } else if (activeTab === "COMPLETE") {
            return `Completed Tasks (${completedTasks.length} of ${allTasks.length})`
        } else if (activeTab === "DELETE") {
            return `Deleted Tasks (${deletedTasks.length} of ${allTasks.length})`
        } else if (activeTab === "DUE") {
            return `Due Soon Tasks (${dueSoonTasks.length} of ${allTasks.length})`
        } else if (activeTab === "PENDING") {
            return `Pending Tasks (${pendingTasks.length} of ${allTasks.length})`
        } else {
            this.setState({activeTab: "TODO" })
            return alert("Something Went Wrong. Please try Again!")
        }
    }

    renderNoTasksView = (tab) => {
        const tabName = this.getTabName(tab)
        const tabNameParts = tabName.split('(')
        return(
            <div className='no-task-view'>
                <img
                    src="https://res.cloudinary.com/duzlefgz6/task-not-found-4810738-4009510_1_ky7zx4.png"
                    alt="NoTask"
                    className='no-task-img' />
                <h3 className='not-found-text'>No Tasks Found in {tabNameParts[0]}</h3>
            </div>
        )
    }

    getIncompletedTasks = () => {
        const {allTasks, searchInput, category} = this.state
        const date = new Date();
        const currDate = date.toLocaleDateString('en-GB').split('/').reverse().join('-')
        if (searchInput !== "" && category === "All") {
            const inCompleteTasks = allTasks.filter(
                each => each.isCompleted === false && each.isDeleted === false && each.duedate >= currDate &&
                each.taskname.toLocaleUpperCase().includes(searchInput.toLocaleUpperCase())
            )
            return inCompleteTasks
        } else if (searchInput === "" && category === "All") {
            const inCompleteTasks = allTasks.filter(
                each => each.isCompleted === false && each.isDeleted === false &&
                each.duedate >= currDate
            )
            return inCompleteTasks
        } else {
            const inCompleteTasks = allTasks.filter(
                each => each.isCompleted === false && each.isDeleted === false &&
                each.priority === category && each.duedate >= currDate
                && each.taskname.toLocaleUpperCase().includes(searchInput.toLocaleUpperCase())
            )
            return inCompleteTasks
        }
    }

    getCompletedTasks = () => {
        const {allTasks, searchInput, category} = this.state
        if (searchInput !== "" && category === "All") {
            const completeTasks = allTasks.filter(
                each => each.isCompleted !== false && each.isDeleted === false &&
                each.taskname.toLocaleUpperCase().includes(searchInput.toLocaleUpperCase())
            )
            return completeTasks
        } else if (searchInput === "" && category === "All") {
            const completeTasks = allTasks.filter(
                each => each.isCompleted !== false && each.isDeleted === false
            )
            return completeTasks
        } else {
            const completeTasks = allTasks.filter(
                each => each.isCompleted !== false && each.isDeleted === false &&
                each.priority === category
                && each.taskname.toLocaleUpperCase().includes(searchInput.toLocaleUpperCase())
            )
            return completeTasks
        }
    }

    getDeletedTasks = () => {
        const {allTasks, searchInput, category} = this.state
        if (searchInput !== "" && category === "All") {
            const deletedTasks = allTasks.filter(
                each => each.isDeleted === true && each.isCompleted === false &&
                each.taskname.toLocaleUpperCase().includes(searchInput.toLocaleUpperCase())
            )
            return deletedTasks
        } if (searchInput === "" && category === "All") {
            const deletedTasks = allTasks.filter(
                each => each.isDeleted === true && each.isCompleted === false
            )
            return deletedTasks
        } else {
            const deletedTasks = allTasks.filter(
                each => each.isDeleted === true && each.isCompleted === false &&
                each.priority === category
                && each.taskname.toLocaleUpperCase().includes(searchInput.toLocaleUpperCase())
            )
            return deletedTasks
        }
    }

    getDueSoonTasks = () => {
        const {allTasks, searchInput, category} = this.state
        const date = new Date();
        const currDate = date.toLocaleDateString('en-GB').split('/').reverse().join('-')
        if (searchInput !== "" && category === "All") {
            const dueSoonTasks = allTasks.filter(
                each => each.duedate === currDate && each.isCompleted === false &&
                each.isDeleted === false &&
                each.taskname.toLocaleUpperCase().includes(searchInput.toLocaleUpperCase())
            )
            return dueSoonTasks
        } else if (searchInput === "" && category === "All") {
            const dueSoonTasks = allTasks.filter(
                each => each.duedate === currDate && each.isCompleted === false &&
                each.isDeleted === false
            )
            return dueSoonTasks
        } else {
            const dueSoonTasks = allTasks.filter(
                each => each.duedate === currDate && each.isCompleted === false &&
                each.isDeleted === false && each.priority === category &&
                each.taskname.toLocaleUpperCase().includes(searchInput.toLocaleUpperCase())
            )
            return dueSoonTasks
        }
    }

    getPendingTasks = () => {
        const {allTasks, searchInput, category} = this.state
        const date = new Date();
        const currDate = date.toLocaleDateString('en-GB').split('/').reverse().join('-')
        if (searchInput !== "" && category === "All") {
            const PendingTasks = allTasks.filter(
                each => each.duedate < currDate && each.isCompleted === false &&
                each.isDeleted === false &&
                each.taskname.toLocaleUpperCase().includes(searchInput.toLocaleUpperCase())
            )
            return PendingTasks
        } else if (searchInput === "" && category === "All") {
            const PendingTasks = allTasks.filter(
                each => each.duedate < currDate && each.isCompleted === false &&
                each.isDeleted === false
            )
            return PendingTasks
        } else {
            const PendingTasks = allTasks.filter(
                each => each.duedate < currDate && each.isCompleted === false &&
                each.isDeleted === false && each.priority === category &&
                each.taskname.toLocaleUpperCase().includes(searchInput.toLocaleUpperCase())
            )
            return PendingTasks
        }
    }

    getAllPendingTasks = () => {
        const {allTasks} = this.state
        const date = new Date();
        const currDate = date.toLocaleDateString('en-GB').split('/').reverse().join('-')
        const PendingTasks = allTasks.filter(
            each => each.duedate < currDate && each.isCompleted === false &&
            each.isDeleted === false
        )
        return PendingTasks
    }

    deleteTask = (id) => {
        const {userData} = this.state

        // updating isDeleted status with firebase
        const changeDeleteStatus = async () => {
            const docRef = doc(db, `users/${userData.userId}/user-tasks`, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                await updateDoc(docRef, {isDeleted: true})
                this.handleOpenSnackbar(true, 'task added to deleted list!', 'warning')
              } else {
                this.handleOpenSnackbar(true, `No such document with ${id} in userId ${userData.userId}`, 'error')
              }
        }
        changeDeleteStatus()
    }

    deleteUndoTask = (id) => {
        const {userData} = this.state
        const changeDeleteStatus = async () => {
            const docRef = doc(db, `users/${userData.userId}/user-tasks`, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                await updateDoc(docRef, {isDeleted: false})
                this.handleOpenSnackbar(true, 'task removed from deleted list!', 'info')
              } else {
                this.handleOpenSnackbar(true, `No such document with ${id} in userId ${userData.userId}`, 'error')
              }
        }
        changeDeleteStatus()
    }

    renderRespectiveView = (tab) => {
        if (tab === "TODO") {
            const tasksList = this.getIncompletedTasks()
            return(
                tasksList.length > 0 ? (
                    <ul className='all-task-list'>
                        {tasksList.map((e) => (
                            <TaskCard 
                                taskData={e}
                                key={e.id}
                                completedTaskStatus={this.completedTaskStatus}
                                deleteTask={this.deleteTask}
                                deleteUndoTask={this.deleteUndoTask}
                                undoCompleteTaskStatus={this.undoCompleteTaskStatus}
                            />
                        ))}
                    </ul>) :
                this.renderNoTasksView(tab)
            )
        } else if (tab === "COMPLETE") {
            const tasksList = this.getCompletedTasks()
            return(
                tasksList.length > 0 ? (
                    <ul className='all-task-list'>
                        {tasksList.map((e) => (
                            <TaskCard 
                                taskData={e}
                                key={e.id}
                                completedTaskStatus={this.completedTaskStatus}
                                deleteTask={this.deleteTask}
                                deleteUndoTask={this.deleteUndoTask}
                                undoCompleteTaskStatus={this.undoCompleteTaskStatus}
                            />
                        ))}
                    </ul>) :
                this.renderNoTasksView(tab)
            )
        } else if (tab === "DELETE") {
            const tasksList = this.getDeletedTasks()
            return(
                tasksList.length > 0 ? (
                    <ul className='all-task-list'>
                        {tasksList.map((e) => (
                            <TaskCard 
                                taskData={e}
                                key={e.id}
                                completedTaskStatus={this.completedTaskStatus}
                                deleteTask={this.deleteTask}
                                deleteUndoTask={this.deleteUndoTask}
                                undoCompleteTaskStatus={this.undoCompleteTaskStatus}
                            />
                        ))}
                    </ul>) :
                this.renderNoTasksView(tab)
            )
        } else if (tab === "DUE") {
            const tasksList = this.getDueSoonTasks()
            return(
                tasksList.length > 0 ? (
                    <ul className='all-task-list'>
                        {tasksList.map((e) => (
                            <TaskCard 
                                taskData={e}
                                key={e.id}
                                completedTaskStatus={this.completedTaskStatus}
                                deleteTask={this.deleteTask}
                                deleteUndoTask={this.deleteUndoTask}
                                undoCompleteTaskStatus={this.undoCompleteTaskStatus}
                            />
                        ))}
                    </ul>) :
                this.renderNoTasksView(tab)
            )
        } else if (tab === "PENDING") {
            const tasksList = this.getPendingTasks()
            return(
                tasksList.length > 0 ? (
                    <ul className='all-task-list'>
                        {tasksList.map((e) => (
                            <TaskCard 
                                taskData={e}
                                key={e.id}
                                completedTaskStatus={this.completedTaskStatus}
                                deleteTask={this.deleteTask}
                                deleteUndoTask={this.deleteUndoTask}
                                undoCompleteTaskStatus={this.undoCompleteTaskStatus}
                            />
                        ))}
                    </ul>) :
                this.renderNoTasksView(tab)
            )
        }
    }

    onSearch = (e) => {
        this.setState({searchInput: e.target.value})
    }

    onChangeCategory = (e) => {
        this.setState({category: e.target.value})
    }

    onChangeLabelInput = (val) => {
        this.setState({labelName: val})
    }

    onChangeColorInput = (val) => {
        this.setState({labelColor: val})
    }

    onCreateNewLabel = () => {
        // creating new label with state for quick action in UI
        const {labelName, labelColor, userData} = this.state
        const firLetter = labelName[0].toUpperCase()
        const labelname = firLetter + labelName.substring(1)
        const newLabel = {
            date: serverTimestamp(),
            labelText: labelname,
            labelColor: labelColor,
            createdAt: new Date().toLocaleString(),
        }
        this.setState(prev => ({
            // allLabels: [...prev.allLabels, newLabel],
            labelName: "", labelColor: "#c731de",
        }))
        this.handleOpenSnackbar(true, `${labelname} label added successfully!`, 'success')

        // creating new label with firebase
        const addNewLabel = async () => {
            const labelsColloctionRef = collection(db, `users/${userData.userId}/user-labels`)
            await addDoc(labelsColloctionRef, newLabel)
        }
        addNewLabel()
    }

    deleteLabel = (id) => {
        const {allLabels, allTasks, userData} = this.state
        const toDeleteLabel = allLabels.filter(e => e.id === id)
        const label = toDeleteLabel[0].labelText
        let counter = 0
        for (let task of allTasks) {
            if (task.priority === label) {
                counter += 1
            }
        }
        if (counter === 0) {
            // const updatedLabelsList = allLabels.filter(e => e.id !== id)
            // this.setState({allLabels: updatedLabelsList})
            
            const delLabelInFireBase =  async () => {
                const docRef = doc(db, `users/${userData.userId}/user-labels`, id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    await deleteDoc(docRef, id)
                    this.handleOpenSnackbar(true, `${label} label Deleted!`, 'warning')
                } else {
                    this.handleOpenSnackbar(true, `No such document with ${id} in userId ${userData.userId}`, 'error')
                }
            }
            delLabelInFireBase()

        } else {
            this.handleOpenSnackbar(true, `you can't Delete ${label} label as it is exists in Tasks!`, 'error')
        }
    }

    editLabelText = (val) => {
        this.setState({editedLabelText: val})
    }

    editLabelColor = (val) => {
        this.setState({editedLabelColor: val})
    }

    editLabel = (id) => {
        console.log(id)
        const {allLabels, editedLabelText, editedLabelColor, userData, allTasks} = this.state
        const firLetter = editedLabelText[0].toUpperCase()
        const labelname = firLetter + editedLabelText.substring(1)
        let counter = 0
        for (let i of allTasks) {
            if (i.priority === labelname) {
                counter += 1
            }
        }
        if (counter === 0) {
            console.log('1')
            for (let i of allLabels) {
                if (i.id === id) {
                    i.labelText = labelname
                    i.labelColor = editedLabelColor
                }
            this.setState({allLabels: allLabels})
            this.handleOpenSnackbar(true, 'Label updated successfully!', 'success')
    
            const update = async () => {
                const docRef = doc(db, `users/${userData.userId}/user-labels`, id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    await updateDoc(docRef, {labelText: labelname, labelColor: editedLabelColor})
                  } else {
                    // docSnap.data() will be undefined in this case
                    console.log(`No such document with ${id} in userId ${userData.userId}`);
                    this.handleOpenSnackbar(true, 'Something went wrong. please try again!', 'error')
                  }
            }
            update()
            }
        } else {
            console.log('2')
            this.handleOpenSnackbar(true, `you can't update ${labelname} label as it is exists in Tasks!`, 'error')
        }
        
    }

    setEditableLabelData = data => {
        this.setState({editedLabelText: data.labelText, editedLabelColor: data.labelColor})
    }

    onLogout = async () => {
        this.setState({userData: ''})
        Cookies.remove('jwt_token')
        localStorage.removeItem('user_info')
        await signOut(auth)
    }

    renderLoader = () => (
        <div className="tasks-loader-container">
            <BallTriangle 
                height={170}
                width={170}
                radius={4}
                color="#1ac2d9"
                ariaLabel="ball-triangle-loading"
                wrapperClass={{}}
                wrapperStyle=""
                visible={true}
            />
        </div>
    )

    onModalOpen = () => {
        this.setState({profileModalOpen: true})
    }

    onModalClose = () => {
        this.setState({profileModalOpen: false})
    }

    getGreeting = () => {
        let timeNow = new Date().getHours();
        let greeting = timeNow >= 5 && timeNow < 12 ? "Good Morning" :
        timeNow >= 12 && timeNow < 18 ? "Good Afternoon" : "Good evening";
        return greeting
    }

    handleOpenSnackbar = (open, msg, type) => {
        this.setState({snackbarData: {open, msg, type}})
    }

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
          }
      
        this.setState({snackbarData: {open: false}})
    }

    handleOpenLogoutDialog = () => {
        this.setState({logoutDialogOpen: true})
    }

    handleCloseLogoutDialog = () => {
        this.setState({logoutDialogOpen: false})
    }

    render() {
        const {
            taskName,
            taskDetails,
            priority,
            dueDate,
            activeTab,
            searchInput,
            category,
            labelName,
            labelColor,
            allLabels,
            editedLabelText,
            editedLabelColor,
            allTasks,
            userData,
            apiStatus,
            notesCount,
            snackbarData,
            profileModalOpen,
            logoutDialogOpen
        } = this.state
        const pendingTasks = this.getAllPendingTasks()
        const shakeStatus = pendingTasks.length > 0 ? 'tooltip shake' : 'tooltip'
        const shakeEleStatus = pendingTasks.length > 0 ? 'element' : ''
        const jwtToken = Cookies.get('jwt_token')
        const vertical = 'bottom'
        const horizontal = 'right'
        // const userDataKeysLength = Object.keys(userData).length
        const Alert = React.forwardRef(function Alert(props, ref) {
            return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
        });
          
        if (jwtToken === undefined) {
            return <Navigate to='/login' replace={true} />
        }

        return(
            <newTaskContext.Provider 
                value={{
                    taskName,
                    taskDetails,
                    priority,
                    dueDate,
                    activeTab,
                    labelName,
                    labelColor,
                    allLabels,
                    editedLabelText,
                    editedLabelColor,
                    allTasks,
                    changeTask: this.changeTask,
                    changeTaskDetails: this.changeTaskDetails,
                    changePriority: this.changePriority,
                    changeDueDate: this.changeDueDate,
                    createNewTask: this.createNewTask,
                    changeTab: this.changeTab,
                    changeLabelInput: this.onChangeLabelInput,
                    changeLabelColor: this.onChangeColorInput,
                    createNewLabel: this.onCreateNewLabel,
                    deleteLabel: this.deleteLabel,
                    editLabelText: this.editLabelText,
                    editLabelColor: this.editLabelColor,
                    editLabel: this.editLabel,
                    setEditableLabelData: this.setEditableLabelData,
                }}>
                <div className='bg-container'>
                    <div className='app-container'>
                        <div className='sidebar-box'>
                            <div className='title-box'>
                                <img 
                                    src="https://res.cloudinary.com/duzlefgz6/image/upload/unnamed_mjvrzg.png" 
                                    className='app-logo' 
                                    alt='title-logo' 
                                />
                                <div className='app-title'>
                                    <h2>ToDo</h2>
                                    <h2>ToDo</h2>
                                </div>
                            </div>
                            <h5 className='welcome-msg'>Welcome to Moderen Admin Dashboard</h5>
                            <Sidebar pendingTasks={pendingTasks} apiStatus={apiStatus} />
                        </div>
                        <div className='all-tasks-container'>
                            <div className='username-search-reminder-avatar-box'>
                                <h3 className='user-name'>{this.getGreeting()}, {userData?.name}</h3>
                                <div className='search-reminder-avatar-box'>
                                    <div className='search-box'>
                                        <input 
                                            value={searchInput}
                                            type="search"
                                            className='search-element'
                                            placeholder='Search Task here'
                                            onChange={this.onSearch} />
                                        <GoSearch className='search-icon' />
                                    </div>

                                    {/* note popup starts */}
                                    <Popup
                                        className="pop-up"
                                        modal
                                        trigger={
                                            <div className='tooltip'>
                                                <Badge badgeContent={notesCount} color="success">
                                                    <button className='msg-btn' type='button'>
                                                        <FiMessageSquare className='msg-icon' />
                                                    </button>
                                                </Badge>
                                                <span className="tooltiptext">Note</span>
                                            </div>}>
                                            {close => (
                                                <div className="note-container">
                                                    <IoMdClose className="close-icon" title='close' onClick={() => close()} />
                                                    <NotePad handleOpenSnackbar={this.handleOpenSnackbar} />
                                                </div>
                                            )}
                                    </Popup>
                                    {/* note popup ends */}
                                    
                                    {/* reminder popup starts */}
                                    <Popup
                                        className="pop-up"
                                        modal
                                        trigger={
                                            <div className={shakeStatus}>
                                                <Badge badgeContent={pendingTasks.length} color="warning" className={shakeEleStatus}>
                                                    <button className='msg-btn' type='button'>
                                                        <AiOutlineBell className='msg-icon' />
                                                    </button>
                                                </Badge>
                                                <span className="tooltiptext">Reminder</span>
                                            </div>}>
                                            {close => (
                                                <div className="reminder-container">
                                                    <IoMdClose className="close-icon" title='close' onClick={() => close()} />
                                                    <div className='reminder-msg-box'>
                                                        <BsExclamationCircle fontSize={22} color='#ad0a46' />
                                                        <h2 className='reminder-msg'>You have following Tasks are in pending! Please complete them ASAP!!</h2>
                                                    </div>
                                                    <div className='table-box'>
                                                        <table id="tb2" style={{width: pendingTasks.length > 0 ? '99%' : '100%'}}>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Task Name</th>
                                                                <th style={{width: "480px"}}>Task Details</th>
                                                                <th>Due Date</th>
                                                                <th>Status</th>
                                                            </tr>
                                                            {pendingTasks.map(e => (
                                                                <tr key={e.id}>
                                                                    <td>&nbsp;</td>
                                                                    <td>{e.taskname}</td>
                                                                    <td>{e.taskdetails}</td>
                                                                    <td>{e.duedate}</td>
                                                                    <td>Pending</td>
                                                                </tr>
                                                            ))}
                                                        </table>
                                                    </div>
                                                    {pendingTasks.length > 0 ? (null) : (
                                                        <div className='no-pending-box'>
                                                            <h2 className='no-pending-text'>No Pending Tasks Found</h2>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                    </Popup>
                                    {/* reminder popup ends */}
                                    
                                    {/* profile modal starts */}
                                    <div className='tooltip'>
                                        {userData.userImageUrl === null || userData.userImageUrl === undefined || userData.userImageUrl === '' ? <CgProfile className='profile-icon' onClick={this.onModalOpen} /> : 
                                        <img src={userData.userImageUrl} className='profile-img' alt="avatar" width="50px" onClick={this.onModalOpen} />}
                                        <span className="tooltiptext" style={{marginTop: '0px', marginLeft: '-20px'}}>Profile</span>
                                    </div>
                                    <Modal
                                        open={profileModalOpen}
                                        onClose={this.onModalClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                        >
                                        <Box className="profile-modal">
                                            <MdArrowDropUp className="arrow" />
                                            <IoMdClose className="close-icon" color='#fff' title='close' onClick={this.onModalClose} />
                                            <Profile handleOpenSnackbar={this.handleOpenSnackbar} />
                                        </Box>
                                    </Modal>
                                    {/* profile modal ends */}

                                    <div className='tooltip'>
                                        <RiLogoutCircleRLine onClick={this.handleOpenLogoutDialog} className='logout-btn' />
                                        <span className="tooltiptext" style={{marginTop: '0px', marginLeft: '-24px'}}>Logout</span>
                                    </div>
                                    <Modal
                                        // animate={{scale: 1, x: 100}} initial={{scale: 0}}
                                        open={logoutDialogOpen}
                                        onClose={this.handleCloseLogoutDialog}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                        >
                                        <Box  className="logout-dialog">
                                            <h3 className="are-you-sure-text">Are you Sure! You want to Logout?</h3>
                                            <div className='buttons-box'>
                                                <button className='btn cancel' onClick={this.handleCloseLogoutDialog}>Cancel</button>
                                                <button className='btn delete' onClick={this.onLogout}>Logout</button>
                                            </div>
                                        </Box>
                                    </Modal>
                                </div>
                            </div>
                            <div className='category-refresh-box'>
                                <div className='category-box'>
                                    <BsInfoCircle className='info-icon' />
                                    <h3 className='category-type'>{this.getTabName(activeTab)}</h3>
                                </div>
                                <div className='refresh-category-box'>
                                    <h3 className='category-text'>Category</h3>
                                    <select value={category} className='category-select' onChange={this.onChangeCategory}>
                                        <option value="All" className='cat-opt'>All</option>
                                        {allLabels.map((e) => (
                                            <option value={e.labelText} className='cat-opt' key={e.labelText}>{e.labelText}</option>
                                        ))}
                                    </select>
                                    <button className="refresh-btn" type='button'>
                                        <span className='text'>Refresh</span>
                                    </button>
                                </div>
                            </div>
                            <hr className='seperation-line' />
                            {apiStatus === apiConstants.inProgress ? this.renderLoader() : this.renderRespectiveView(activeTab)}
                            <Snackbar 
                                open={snackbarData.open} 
                                autoHideDuration={6000}
                                anchorOrigin={{vertical, horizontal}}
                                key={vertical + horizontal}
                                sx={{margin: '0px 15px 15px 0px'}}
                                onClose={this.handleCloseSnackbar}
                                >
                                <Alert
                                    onClose={this.handleCloseSnackbar}
                                    severity={snackbarData.type}
                                    sx={{ width: '100%' }}
                                    >
                                    {snackbarData.msg}
                                </Alert>
                            </Snackbar>
                        </div>
                    </div>
                </div>
            </newTaskContext.Provider>
        )
    }
}

export default Todos