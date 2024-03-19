import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MdEmail, MdLock, MdPhotoCamera } from 'react-icons/md'
import { FcAddImage, FcRemoveImage } from 'react-icons/fc'
import { RxAvatar } from 'react-icons/rx'
import { BsPhone } from 'react-icons/bs'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { storage } from '../../Firebase-config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db } from '../../Firebase-config'
import { ThreeDots } from 'react-loader-spinner'
import { apiConstants } from '../../AppConstants/constants'
import Cookies from 'js-cookie'
import './index.css'

const Register = () => {
    const [userName, setName] = useState('')
    const [mobileNo, setMobileNo] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [image, setImage] = useState(null)
    const [errMsg, setErrMsg] = useState('')
    const [apiStatus, setApiStatus] = useState(apiConstants.initial)

    const navigate = useNavigate();
    const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    const isMobileNumber = (mobileNo) => /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(mobileNo)
    let imageUrl = image && (window.URL || window.webkitURL).createObjectURL(image)
    console.log(imageUrl, 'hhhhhhh')

    useEffect(() => {
        const jwtToken = Cookies.get('jwt_token')
        if (jwtToken !== undefined) {
            return navigate('/', {replace: true})
        }
    })

    const registerUser = async () => {
        try {
            if (registerEmail !== '' && registerPassword !== '' && userName !== '' && confirmPassword !== '' && mobileNo !== '') {
                if (registerPassword !== confirmPassword) {
                    setErrMsg(`*Password did't match`)
                } else if (!isEmail(registerEmail)) {
                    setErrMsg('*Invalid email!')
                } else if (!isMobileNumber(mobileNo)) {
                    setErrMsg('*Invalid mobile number!')
                } else {
                    setApiStatus(apiConstants.inProgress)
                    const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)

                    // creating user doc in db with same auth. ID
                    // uploading user image in firestore with dame auth. ID
                    const imageRef = ref(storage, `user-avatars/${user.user.uid}`)
                    image && await uploadBytes(imageRef, image)
                    await getDownloadURL(imageRef).then((url) => imageUrl = url)
                    await setDoc(doc(db, 'users', user.user.uid), {email: user.user.email, name: userName, mobile_no: Number(mobileNo), userImageUrl: imageUrl})
                    
                    const userInfo = {
                        userId: user.user.uid,
                        operationType: user.operationType,
                        name: userName,
                    }
                    Cookies.set('jwt_token', user.user.accessToken, {expires: 1})
                    localStorage.setItem('user_info', JSON.stringify(userInfo))
                    localStorage.setItem('activeTab', 'TODO')
                    setRegisterEmail('')
                    setRegisterPassword('')
                    navigate('/', {replace: true})
                }
            } else {
                setErrMsg('*All fields are mandatory!')
            }
        } catch (error) {
            setApiStatus(apiConstants.success)
            if (error.message === "Firebase: Error (auth/email-already-in-use).") {
                setErrMsg('*This Email Adress alreay exists!')
            } else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
                setErrMsg('*Password should be at least 6 characters!')
            } else if (error.message === 'Firebase: Error (auth/network-request-failed).') {
                setErrMsg('*You are offline. please check your network!')
            } else if (error.message === 'Firebase: Error (auth/invalid-email).') {
                setErrMsg('*Invalid email!')
            } else {
                console.log(error.message)
                setErrMsg(error.message)
            }
        }
    }

    const toggleShowPassword = () => {
        setShowPassword((prev) => (!prev))
    }

    const removeImage = () => {
        setImage(null)
    }

    return (
        <div className="register-container">
            <div className='register-form'>
                <h2 className='register-form-title'><span>Re</span>gistration</h2>
                <div className='register-form-content'>
                    <div className='avatar-name-box'>
                        <div className='avatar-control-box'>
                            <div className='avatar-box'>
                                {image === null || image === undefined ? <MdPhotoCamera className='photo-icon' /> :
                                <img src={imageUrl} alt="avatar" className='user-avatar' />}
                            </div>
                            <div className='control-box'>
                                <input
                                    type='file'
                                    accept="image/*"
                                    id="ADDIMAGE"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    style={{display: 'none'}}
                                />
                                <p className='optional-text'><sup>*</sup>optional</p>
                                <label for="ADDIMAGE" style={{display: 'flex', width: '140px', marginBottom: '10px'}}>
                                    <p className='add-img-label'>Add Image: </p>
                                    <FcAddImage  className='folder-icon' />
                                </label>
                                
                                {image && (
                                    <div style={{display: 'flex'}}>
                                        <p className='add-img-label'>Remove Image: </p>
                                        <FcRemoveImage  className='folder-icon' onClick={removeImage} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='form-field'>
                            <input
                                className='register-form-input'
                                value={userName}
                                type='text'
                                placeholder='Name'
                                onChange={(event) => {setName(event.target.value)}}
                                required
                            />
                            <RxAvatar className="register-logo" />
                        </div>
                    </div>
                    <div className='email-mobile-pass-cofpass-box'>
                        <div className='form-field'>
                            <input
                                className='register-form-input'
                                value={registerEmail}
                                type='email'
                                placeholder='Email'
                                onChange={(event) => {setRegisterEmail(event.target.value)}}
                                required
                            />
                            <MdEmail className="register-logo" />
                        </div>
                        <div className='form-field'>
                            <input
                                className='register-form-input'
                                value={mobileNo}
                                type='text'
                                placeholder='Mobile number'
                                onChange={(event) => {setMobileNo(event.target.value)}}
                                required
                            />
                            <BsPhone className="register-logo" />
                        </div>
                        <div className='form-field'>
                            <input
                                className='register-form-input'
                                value={registerPassword}
                                type={!showPassword ? 'password' : 'text'}
                                placeholder='Password'
                                onChange={(event) => {setRegisterPassword(event.target.value)}}
                                required
                            />
                            <MdLock className="register-logo" />
                        </div>
                        <div className='form-field'>
                            <input
                                className='register-form-input'
                                value={confirmPassword}
                                type={!showPassword ? 'password' : 'text'}
                                placeholder='Confirm Password'
                                onChange={(event) => {setConfirmPassword(event.target.value)}}
                                required
                            />
                            <MdLock className="register-logo" />
                        </div>
                        <div className='show-password-box'>
                            <input
                                onChange={toggleShowPassword}
                                type="checkbox"
                                id="showPassword"
                                name='showPassword'
                                className='checkbox'
                                />
                            <label className='show-password-text' for="showPassword">Show Password</label>
                        </div>
                    </div>
                </div>
                {apiStatus !== apiConstants.inProgress ? <button className='register-btn' onClick={registerUser}>Register</button> : (
                    <button className='login-btn progress'>
                        <ThreeDots height={40} width={50} radius={2} color="#fff" ariaLabel="ball-triangle-loading" visible={true} />
                    </button>
                )}
                {errMsg === '' ? null : (<p className='err-msg'>{errMsg}</p>)}
                <p className='have-acc-text'>Already have an account? <Link to='/login'>Sign In</Link></p>
            </div>
            <img src="https://res.cloudinary.com/duzlefgz6/image/upload/Vectors_gvqpjm.png" alt="bg" className='register-bg' />
        </div>
    )
}

export default Register

