import { Fragment, useEffect, useState } from 'react'
// import {BsExclamationCircle, BsCheckCircle} from 'react-icons/bs'
import {SlNote} from 'react-icons/sl'
import NoteItem from '../NoteItem'
import { collection, updateDoc, doc, getDoc, addDoc, deleteDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db } from '../../Firebase-config';
import { BallTriangle } from  'react-loader-spinner'
import { apiConstants } from '../../AppConstants/constants'
import './index.css'


const NotePad = (props) => {
    const {handleOpenSnackbar} = props
    const [allNotes, setAllNotes] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    // const [noteErrMsg, setNoteErrMsg] = useState('')
    const [editNoteId, setEditNoteId] = useState(null)
    const [userData, setUserData] = useState({})
    const [apiStatus, setApiStatus] = useState(apiConstants.initial)

    // const noteErrClass = noteErrMsg === 'Saved!' || noteErrMsg === "Updated!" ? 'note-err-msg note-save' : 'note-err-msg note-error'
    const allnotesCounttext = allNotes.length !== 0 ? `(${allNotes.length} notes)` : null

    useEffect(() => {
        const getUserNotes = async () => {
            const userInfo = JSON.parse(localStorage.getItem('user_info'))
            setUserData(userInfo)

            setApiStatus(apiConstants.inProgress)

            const unsub = onSnapshot(
                collection(db, `users/${userInfo.userId}/user-notes`),
                (snapshot) => {
                    let list = []
                    snapshot.docs.forEach((doc) => {
                        list.push({id: doc.id, ...doc.data()})
                    })
                    setAllNotes(list.sort((a,b) => (a.timeStamp - b.timeStamp)))
                    setTimeout(() => {
                        setApiStatus(apiConstants.success)
                    }, 500)
                }
            )

            return () => {
                unsub()
            }
        }
        getUserNotes()
    }, [])

    const onChangeTitle = (e) => {
        setTitle(e.target.value)
    }

    const onChangeDescription = e => {
        setDescription(e.target.value)
    }

    const onSaveNote = async () => {
        const userNotesCollectionRef = collection(db, `users/${userData.userId}/user-notes`)
        if (editNoteId !== null) {
            // setNoteErrMsg("Updated!")
            setTitle('')
            setDescription('')
            setEditNoteId(null)
            handleOpenSnackbar(true, 'Note updated successfully!', 'success')

            const docRef = doc(userNotesCollectionRef, editNoteId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                await updateDoc(docRef, {updated: true, title, description, lastUpdated: new Date()})
              } else {
                alert('somthing went wrong! please try again.')
              }
        }
        else if (title !== "" && description !== "" && editNoteId === null) {
            const newNote = {
                createdAt: new Date(),
                timeStamp: serverTimestamp(),
                title,
                description,
                isDeleted: false,
                opened: false,
                updated: false,
                lastUpdated: null,
            }
            // console.log(newNote)
            // setNoteErrMsg("Saved!")
            setTitle('')
            setDescription('')
            handleOpenSnackbar(true, 'Note saved successfully!', 'success')
            await addDoc(userNotesCollectionRef,newNote)
        }
        else {
            handleOpenSnackbar(true, 'All fields are mandatory!', 'warning')
            // setNoteErrMsg("All fields are mandatory!")
        }
    }

    const onClearNote = () => {
        if (title !== "" && description !== "") {
            setTitle('')
            setDescription('')
            setEditNoteId(null)
        } else {
            // setNoteErrMsg("Nothing to clear!")
            handleOpenSnackbar(true, 'Nothing to clear!', 'warning')
        }
    }

    const showNote = (id) => {
        const updatedNotes = []
        for (let i of allNotes) {
            if (i.id === id) {
                i.opened = !i.opened
                updatedNotes.push(i)
            } else {
                i.opened = false
                updatedNotes.push(i)
            }
        }
        setAllNotes(updatedNotes)
    }

    const deleteNote = async (id) => {
        const docRef = doc(db, `users/${userData.userId}/user-notes`, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await deleteDoc(docRef, id)
            handleOpenSnackbar(true, 'Note Deleted!', 'warning')
        } else {
            console.log("No such document!");
            handleOpenSnackbar(true, 'somthing went wrong! please try again.', 'error')
        }
    }

    const renderLoader = () => (
        <div className="note-loader-container">
            <BallTriangle height={100} width={100} radius={4} color="#1ac2d9" ariaLabel="ball-triangle-loading" visible={true} />
        </div>
    )

    const renderemptyNotesView = () => (
        <div className='empty-notes-view'>
            <SlNote className='note-icon' />
            <h3 className='no-notes-text'>No Notes Yet!</h3>
        </div>
    )

    const editNote = (id) => {
        for (let note of allNotes) {
            if (note.id === id) {
                setTitle(note.title)
                setDescription(note.description)
                setEditNoteId(id)
            }
        }
    }

    const renderNotes = () => (
        <div className='saved-notes-box'>
            {allNotes.length !== 0 ? (
                allNotes.map((e) => (
                    <NoteItem
                        noteDetails={e}
                        key={e.id}
                        showNote={showNote}
                        deleteNote={deleteNote}
                        editNote={editNote}
                    />
                ))
            ) : renderemptyNotesView()}
        </div>
    )

    return(
        <Fragment>
            <div className='note-headings-box'>
                <h3 className='notepad-caption'>Note your important points here!</h3>
                <div className='allnotes-heading-box'>
                    <h3 className='notepad-caption'>All Notes <span className='allnotes-count'>{allnotesCounttext}</span></h3>
                </div>
            </div>
            <div className='note-input-saved-note-box'>
                <div className='note-box'>
                    <div className='note-input-box'>
                        <input
                            value={title}
                            type="text"
                            className='note-title-input'
                            placeholder='Title'
                            onChange={onChangeTitle}
                            title='give the Title'
                        />
                        <textarea
                            rows="4"
                            cols="50"
                            value={description}
                            className='note-text-input'
                            placeholder='write your points here!'
                            onChange={onChangeDescription}>
                        </textarea>
                        </div>
                    <div className='save-btn-box'>
                        {/* {noteErrMsg !== "" ? (
                            <div className="msg-box" style={{height: '15px', marginRight: "30px"}}>
                                {noteErrMsg === "Saved!" || noteErrMsg === "Updated!" ? (
                                    <BsCheckCircle className="msg-info-logo" style={{color: "green"}} />
                                ): (
                                    <BsExclamationCircle className="msg-info-logo" style={{color: "red"}} />
                                )}
                                
                                <p className={noteErrClass}>{noteErrMsg}</p> 
                            </div>
                        ) : null} */}
                        <button className='note-btn clear' onClick={onClearNote} title='clear the note'>Clear</button>
                        <button className='note-btn save' onClick={onSaveNote} title='save the note'>Save</button>
                    </div>
                    
                </div>
                {apiStatus === apiConstants.inProgress ? renderLoader() : renderNotes()}
            </div>
        </Fragment>
    )
}

export default NotePad

// class NotePad extends Component {
//     state = {
//         allNotes: [],
//         title: "",
//         description: "",
//         noteErrMsg: "",
//         editNoteId: null,
//         userData: {},
//         apiStatus: apiConstants.initial
//     }

//     componentDidMount() {
//         const userInfo = JSON.parse(localStorage.getItem('user_info'))
//         this.setState({userData: userInfo})
//         // const userNotesCollectionRef = collection(db, `users/${userInfo.userId}/user-notes`)

//         // getting current user's notes from firebase
//         this.setState({apiStatus: apiConstants.inProgress})
//         // const getUserNotes = async () => {
//         //     const notesData = await getDocs(userNotesCollectionRef)
//         //     const pureUserNoteData = notesData.docs.map((doc) => ({...doc.data(), id: doc.id}))
//         //     this.setState({
//         //         userData: userInfo,
//         //         allNotes: pureUserNoteData.sort((a,b) => (a.timeStamp - b.timeStamp)),
//         //         apiStatus: apiConstants.success
//         //     })
            
//         // }
//         // getUserNotes()

//         const unsub = onSnapshot(
//             collection(db, `users/${userInfo.userId}/user-notes`),
//             (snapshot) => {
//                 let list = []
//                 snapshot.docs.forEach((doc) => {
//                     list.push({id: doc.id, ...doc.data()})
//                 })
//                 this.setState({
//                     allNotes: list.sort((a,b) => (a.timeStamp - b.timeStamp)),
//                     apiStatus: apiConstants.success,
//                 })
//             }
//         )
//         return () => {
//             unsub()
//         }
//     }

//     onChangeTitle = e => {
//         this.setState({title: e.target.value})
//     }

//     onChangeDescription = e => {
//         this.setState({description: e.target.value})
//     }

//     onSaveNote = async () => {
//         const {title, description, editNoteId, userData} = this.state
//         const userNotesCollectionRef = collection(db, `users/${userData.userId}/user-notes`)
//         if (editNoteId !== null) {
//             // for (let note of allNotes) {
//             //     if (note.id === editNoteId) {
//             //         note.title = title
//             //         note.description = description
//             //         note.updated = true
//             //     }
//             // }
//             this.setState({noteErrMsg: "Updated!", title: "", description: "", editNoteId: null})

//             const docRef = doc(userNotesCollectionRef, editNoteId);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 await updateDoc(docRef, {updated: true, title, description, lastUpdated: new Date()})
//               } else {
//                 // docSnap.data() will be undefined in this case
//                 console.log("No such document!");
//                 alert('somthing went wrong! please try again.')
//               }
//         }
//         else if (title !== "" && description !== "" && editNoteId === null) {
//             const newNote = {
//                 createdAt: new Date(),
//                 timeStamp: serverTimestamp(),
//                 title,
//                 description,
//                 isDeleted: false,
//                 opened: false,
//                 updated: false,
//                 lastUpdated: null,
//             }
//             // console.log(newNote)
//             // this.setState(prev =>({allNotes: [...prev.allNotes, newNote], noteErrMsg: "Saved!", title: "", description: ""}))
//             this.setState({noteErrMsg: "Saved!", title: "", description: ""})
//             await addDoc(userNotesCollectionRef,newNote)
//         }
//         else {
//             this.setState({noteErrMsg: "All fields are mandatory!"})
//         }
//     }

//     onClearNote = () => {
//         const {title, description} = this.state
//         if (title !== "" && description !== "") {
//             this.setState({title: "", description: "", editNoteId: null})
//         } else {
//             this.setState({noteErrMsg: "Nothing to clear!"})
//         }
//     }

//     showNote = (id) => {
//         const {allNotes} = this.state
//         for (let i of allNotes) {
//             if (i.id === id) {
//                 i.opened = !i.opened
//             } else {
//                 i.opened = false
//             }
//         }
//         this.setState({allNotes: allNotes})
//     }

//     deleteNote = async (id) => {
//         const {userData} = this.state
//         // const filteredList = allNotes.filter((e) => e.id !== id)
//         // this.setState({allNotes: filteredList})
        
//         const docRef = doc(db, `users/${userData.userId}/user-notes`, id);
//         console.log(docRef)
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//             await deleteDoc(docRef, id)
//         } else {
//             console.log("No such document!");
//             alert('somthing went wrong! please try again.')
//         }
//     }

//     renderLoader = () => (
//         <div className="note-loader-container">
//             <BallTriangle height={100} width={100} radius={4} color="#1ac2d9" ariaLabel="ball-triangle-loading" visible={true} />
//         </div>
//     )

//     renderemptyNotesView = () => (
//         <div className='empty-notes-view'>
//             <SlNote className='note-icon' />
//             <h3 className='no-notes-text'>No Notes Yet!</h3>
//         </div>
//     )

//     renderNotes = () => {
//         const {allNotes} = this.state
//         return(
//             <div className='saved-notes-box'>
//                 {allNotes.length !== 0 ? (
//                     allNotes.map((e) => (
//                         <NoteItem
//                             noteDetails={e}
//                             key={e.id}
//                             showNote={this.showNote}
//                             deleteNote={this.deleteNote}
//                             editNote={this.editNote}
//                         />
//                     ))
//                 ) : this.renderemptyNotesView()}
//             </div>
//         )
//     }

//     editNote = (id) => {
//         const {allNotes} = this.state
//         for (let note of allNotes) {
//             if (note.id === id) {
//                 this.setState({title: note.title, description: note.description, editNoteId: id})
//             }
//         }
//     }

//     render() {
//         const {handleOpenSnackbar} = this.props
//         const {title, description, allNotes, noteErrMsg, apiStatus} = this.state
//         const allnotesCounttext = allNotes.length !== 0 ? `(${allNotes.length} notes)` : null
//         const noteErrClass = 
//             noteErrMsg === 'Saved!' || noteErrMsg === "Updated!" ? 'note-err-msg note-save' : 'note-err-msg note-error'
//         return (
//             <Fragment>
//                 <div className='note-headings-box'>
//                     <h3 className='notepad-caption'>Note your important points here!</h3>
//                     <div className='allnotes-heading-box'>
//                         <h3 className='notepad-caption'>All Notes <span className='allnotes-count'>{allnotesCounttext}</span></h3>
//                     </div>
//                 </div>
//                 <div className='note-input-saved-note-box'>
//                     <div className='note-box'>
//                         <div className='note-input-box'>
//                             <input
//                                 value={title}
//                                 type="text"
//                                 className='note-title-input'
//                                 placeholder='Title'
//                                 onChange={this.onChangeTitle}
//                                 title='give the Title'
//                             />
//                             <textarea
//                                 rows="4"
//                                 cols="50"
//                                 value={description}
//                                 className='note-text-input'
//                                 placeholder='write your points here!'
//                                 onChange={this.onChangeDescription}>
//                             </textarea>
//                          </div>
//                         <div className='save-btn-box'>
//                             {noteErrMsg !== "" ? (
//                                 <div className="msg-box" style={{height: '15px', marginRight: "30px"}}>
//                                     {noteErrMsg === "Saved!" || noteErrMsg === "Updated!" ? (
//                                         <BsCheckCircle className="msg-info-logo" style={{color: "green"}} />
//                                     ): (
//                                         <BsExclamationCircle className="msg-info-logo" style={{color: "red"}} />
//                                     )}
                                    
//                                     <p className={noteErrClass}>{noteErrMsg}</p> 
//                                 </div>
//                             ) : null}
//                             <button className='note-btn clear' onClick={this.onClearNote} title='clear the note'>Clear</button>
//                             <button className='note-btn save' onClick={this.onSaveNote} title='save the note'>Save</button>
//                         </div>
                        
//                     </div>
//                     {apiStatus === apiConstants.inProgress ? this.renderLoader() : this.renderNotes()}
//                 </div>
//             </Fragment>
//         )
//     }
// }

// export default NotePad