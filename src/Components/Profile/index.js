import * as React from 'react'
import { Fragment, useState, useEffect } from 'react'
import { FcEditImage, FcRemoveImage } from 'react-icons/fc'
import { FiEdit, FiCheckSquare} from 'react-icons/fi'
import { CgRemoveR } from 'react-icons/cg'
import { MdPhotoCamera } from 'react-icons/md'
import { BallTriangle }  from 'react-loader-spinner'
import { apiConstants } from '../../AppConstants/constants'
import { auth, db, storage } from '../../Firebase-config'
import { reauthenticateWithCredential, updateEmail } from 'firebase/auth'
import { ref, getDownloadURL, deleteObject, uploadBytes } from "firebase/storage";
import { updateDoc, doc, getDoc, collection, onSnapshot } from 'firebase/firestore'
import Skeleton from '@mui/material/Skeleton';
import './index.css'

const Profile = (props) => {
    const {handleOpenSnackbar} = props
    const [userD, setUserData] = useState()
    const [editStatus, setEditStatus] = useState(false)
    const [apiStatus, setApiStatus] = useState(apiConstants.initial)
    const [imgUpdateStatus, setImgUpdateStatus] = useState(apiConstants.initial)
    const [quote, setQuote] = useState()
    const [changeName, setChangeName] = useState()
    const [changeEmail, setChangeEmail] = useState()
    const [changeMobNum, setChangeMobNum] = useState()
    // const [ChangeImage, setChangeImg] = useState(null)
    // const changeImgUrl = ChangeImage && (window.URL || window.webkitURL).createObjectURL(ChangeImage)

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('user_info'))
        const getUserDataAndRandomQuote = async () => {
            setApiStatus(apiConstants.inProgress)

            // getting realtime updates of userData from firebase
            const unSubUserData = onSnapshot(collection(db, "users"), (snapshot) => {
                snapshot.docs.forEach((doc) => {
                    if (doc.id === userInfo.userId) {
                        setUserData({...doc.data(), userId: doc.id})
                    }
                })
            })

            // getting random quote
            // const quotesUrl = "https://api/quotes"
            // const res = await fetch(quotesUrl)
            // const quotes = await res.json()
            // console.log(quotes, '7777')
            // const randomIndex = Math.floor(Math.random() * (1500 - 0 + 1) ) + 0;
            // setQuote(quotes[randomIndex])

            const randomQuoteUrl = 'https://dummyjson.com/quotes/random'
            const result = await fetch(randomQuoteUrl)
            const randomQuote = await result.json()
            // console.log(randomQuote)
            setQuote(randomQuote)

            // getting userData(name, mobile no, email, user_image) from firebase
            // const docRef = doc(db, 'users', userInfo.userId);
            // const docSnap = await getDoc(docRef);
            // if (docSnap.exists()) {
            //     setUserData({...docSnap.data(), userId: userInfo.userId})
            // } else {
            //     console.log("No such document!");
            //     alert('somthing went wrong! please try again.')
            // }

            // getting current user image from firebase
            // const userImgRef = ref(storage, `user-avatars/${userInfo.userId}`);
            // getDownloadURL(userImgRef).then((url) => {setProfileImgUrl(url)})

            setApiStatus(apiConstants.success)
            // setTimeout(() => {
                // setApiStatus(apiConstants.success)
            // }, 1000)

            return () => {
                unSubUserData()
            }
        }
        getUserDataAndRandomQuote()
    }, [])

    const onCancelEdit = () => {
        setEditStatus(false)
        setChangeName(userD.name)
        setChangeEmail(userD.email)
        setChangeMobNum(userD.mobile_no)
        // setChangeImg(null)
    }

    const onChangeEditStatus = () => {
        setChangeName(userD.name)
        setChangeEmail(userD.email)
        setChangeMobNum(userD.mobile_no)
        setEditStatus(true)
    }

    const onSaveProfileChanges = async () => {
        const docRef = doc(db, 'users', userD.userId);
        const docSnap = await getDoc(docRef);
        if (changeEmail !== userD.email) {
            updateEmail(auth.currentUser, changeEmail).then(
                console.log('updated')
            )
            .catch((error) => {
                console.log(error.message)
                if (error.message === 'Firebase: Error (auth/requires-recent-login).') {
                    // reauthenticateWithCredential()
                }
            })
        }

        if (changeName !== userD.name && changeEmail !== userD.email && changeMobNum !== userD.mobile_no) {
            handleOpenSnackbar(true, 'Profile updated successfully!', 'success')
            if (docSnap.exists()) {
                await updateDoc(docRef, {email: changeEmail, mobile_no: changeMobNum, name: changeName})
                setEditStatus(false)
              } else {
                alert('somthing went wrong! please try again. EMAIL, NAME, MOBILE NO')
            }
        } else if (changeName === userD.name && changeEmail !== userD.email && changeMobNum !== userD.mobile_no) {
            handleOpenSnackbar(true, 'Email, Mobile number updated successfully!', 'success')
            if (docSnap.exists()) {
                await updateDoc(docRef, {email: changeEmail, mobile_no: changeMobNum})
                setEditStatus(false)
              } else {
                alert('somthing went wrong! please try again. EMAIL, MOBILE NO')
            }
        } else if (changeName !== userD.name && changeEmail === userD.email && changeMobNum !== userD.mobile_no) {
            handleOpenSnackbar(true, 'Name, Mobile number updated successfully!', 'success')
            if (docSnap.exists()) {
                await updateDoc(docRef, {name: changeName, mobile_no: changeMobNum})
                setEditStatus(false)
              } else {
                alert('somthing went wrong! please try again. NAME, MOBILE NO')
            }
        } else if (changeName !== userD.name && changeEmail !== userD.email && changeMobNum === userD.mobile_no) {
            handleOpenSnackbar(true, 'Name, Email updated successfully!', 'success')
            if (docSnap.exists()) {
                await updateDoc(docRef, {email: changeEmail, name: changeName})
                setEditStatus(false)
              } else {
                alert('somthing went wrong! please try again. EMAIL, NAME')
            }
        } else if (changeName !== userD.name && changeEmail === userD.email && changeMobNum === userD.mobile_no) {
            handleOpenSnackbar(true, 'Name updated successfully!', 'success')
            if (docSnap.exists()) {
                await updateDoc(docRef, {name: changeName})
                setEditStatus(false)
              } else {
                alert('somthing went wrong! please try again. ONLY NAME')
            }
        } else if (changeName === userD.name && changeEmail !== userD.email && changeMobNum === userD.mobile_no) {
            handleOpenSnackbar(true, 'Email updated successfully!', 'success')
            if (docSnap.exists()) {
                await updateDoc(docRef, {email: changeEmail})
                setEditStatus(false)
              } else {
                alert('somthing went wrong! please try again. ONLY EMAIL')
            }
        } else if (changeName === userD.name && changeEmail === userD.email && changeMobNum !== userD.mobile_no) {
            handleOpenSnackbar(true, 'Mobile number updated successfully!', 'success')
            if (docSnap.exists()) {
                await updateDoc(docRef, {mobile_no: changeMobNum})
                setEditStatus(false)
              } else {
                alert('somthing went wrong! please try again. ONLY MOBILE NO')
            }
        } else {
            handleOpenSnackbar(true, 'No changes found to save!', 'warning')
            setEditStatus(true)
        }

        // setUserData({name: changeName, email: changeEmail, mobile_no: changeMobNum, userId: userD.userId})
    }

    const renderProfileImage = () => {
        if (userD?.userImageUrl === undefined || userD?.userImageUrl === null || userD?.userImageUrl === '')
             {
            // console.log('1')
            return <MdPhotoCamera className='photo-icon' />
        } else {
            return (
                imgUpdateStatus === apiConstants.inProgress ? 
                <Skeleton variant="circular" width={200} height={200} /> 
                : <img src={userD?.userImageUrl} alt="avatar" className='profile-avatar' />
            )
            // if (ChangeImage === null || ChangeImage === undefined) {
            //     // console.log('2')
            //     return (
            //         imgUpdateStatus === apiConstants.inProgress ? 
            //         <Skeleton variant="circular" width={200} height={200} /> 
            //         : <img src={userD?.userImageUrl} alt="avatar" className='profile-avatar' />
            //     )
            // } 
            // else {
            //     // console.log('3')
            //     return <img src={changeImgUrl} alt="" className='profile-avatar' />
            // }
        }
    }

    const onRemoveImage = async () => {
        const docRef = doc(db, 'users', userD.userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await updateDoc(docRef, {userImageUrl: ''})
        } else {
            console.log(`${docRef} not exists`)
        }
        handleOpenSnackbar(true, 'Profile image removed!', 'warning')
        // setUserData({...userD, userImageUrl: ''})
        deleteObject(ref(storage, `user-avatars/${userD?.userId}`))
    }

    const onChangeImage = async e => {
        setImgUpdateStatus(apiConstants.inProgress)
        const docRef = doc(db, 'users', userD.userId);
        const docSnap = await getDoc(docRef);
        // setChangeImg(e.target.files[0])
        const imageFile = e.target.files[0]
        const userImgRef = ref(storage, `user-avatars/${userD?.userId}`);

        if (userD?.userImageUrl) {
            await deleteObject(userImgRef)
            await uploadBytes(userImgRef, imageFile)
            const url = await getDownloadURL(userImgRef)
            if (docSnap.exists()) {
                await updateDoc(docRef, {userImageUrl: url})
                setImgUpdateStatus(apiConstants.success)
                handleOpenSnackbar(true, 'Profile image updated successfully!', 'success')
            } else {
                setImgUpdateStatus(apiConstants.failure)
                handleOpenSnackbar(true, 'Something went wrong. please try again!', 'error')
                console.log(`${docRef} not exists`)
            }
        } else {
            await uploadBytes(userImgRef, imageFile)
            const url = await getDownloadURL(userImgRef)
            if (docSnap.exists()) {
                await updateDoc(docRef, {userImageUrl: url})
                setImgUpdateStatus(apiConstants.success)
                handleOpenSnackbar(true, 'Profile image updated successfully!', 'success')
            } else {
                setImgUpdateStatus(apiConstants.failure)
                handleOpenSnackbar(true, 'Something went wrong. please try again!', 'error')
                console.log(`${docRef} not exists`)
            }
        }
    }

    const renderLoader = () => (
        <div className="profile-loader-container">
            <BallTriangle 
                height={120}
                width={120}
                radius={5}
                color="#1ac2d9"
                ariaLabel="ball-triangle-loading"
                wrapperClass={{}}
                wrapperStyle=""
                visible={true}
            />
        </div>
    )
    
    return( 
        apiStatus === apiConstants.inProgress ? renderLoader() : (
            <Fragment>
                <div className="profile-container">
                    <div className='profile-image-box'>
                        <div className='image-box'>
                            {renderProfileImage()}
                            <div className='img-edit-pnel'>
                                <div className='ctrl-pnel-btn-box'>
                                    <input
                                        id="changeImage"
                                        type='file'
                                        accept='image/*'
                                        onChange={onChangeImage}
                                        style={{display: 'none'}}
                                    />
                                    <label title='edit image' for="changeImage" className='profile-img-ctrl-btn'>
                                        <FcEditImage />
                                    </label>
                                    {userD?.userImageUrl && 
                                        <FcRemoveImage
                                            title='remove image'
                                            className='profile-img-ctrl-btn'
                                            style={{marginBottom: '7px'}}
                                            onClick={onRemoveImage} 
                                        /> 
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul className='user-details-box'>
                        <div className='ctrl-edit-status-box'>
                            {editStatus &&
                                <FiCheckSquare 
                                    className='profile-edit-icon'
                                    onClick={onSaveProfileChanges}
                                    title='save'
                                />
                            }
                            {editStatus &&
                                <CgRemoveR
                                    className='profile-edit-icon'
                                    onClick={onCancelEdit}
                                    title="cancel" 
                                />
                            }
                            {!editStatus &&
                                <FiEdit
                                    className='profile-edit-icon'
                                    onClick={onChangeEditStatus}
                                    title="edit profile"
                                />
                            }
                        </div>
                        <li className='profile-feild'>
                            <h4 className='profile-feild-name'>Name :</h4>
                            {editStatus?
                                <input
                                    value={changeName}
                                    onChange={(e) => setChangeName(e.target.value)}
                                    className='profile-feild-input' 
                                /> :
                            <h4 className='profile-feild-val'>{userD?.name}</h4>}
                        </li>
                        <li className='profile-feild'>
                            <h4 className='profile-feild-name'>Email :</h4>
                            {editStatus?
                                <input
                                    value={changeEmail}
                                    onChange={(e) => setChangeEmail(e.target.value)}
                                    className='profile-feild-input'
                                /> :
                            <h4 className='profile-feild-val'>{userD?.email}</h4>}
                        </li>
                        <li className='profile-feild'>
                            <h4 className='profile-feild-name'>Contact No :</h4>
                            {editStatus?
                                <input
                                    value={changeMobNum}
                                    onChange={(e) => setChangeMobNum(e.target.value)}
                                    className='profile-feild-input' 
                                /> :
                            <h4 className='profile-feild-val'>{userD?.mobile_no}</h4>}
                        </li>
                        {!editStatus && (
                            <li className='profile-feild'>
                                <h4 className='profile-feild-name'>Status :</h4>
                                <h4 className='profile-feild-val'>Active</h4>
                            </li>
                        )}
                    </ul>
                </div>
                <blockquote class="otro-blockquote">
                    {quote?.quote}
                    <span>{quote?.author}</span>
                </blockquote>
            </Fragment>
        )
    )
}

export default Profile