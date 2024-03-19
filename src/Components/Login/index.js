import { useState, useEffect } from 'react'
import { MdEmail, MdLock} from 'react-icons/md'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../Firebase-config'
import { ThreeDots } from  'react-loader-spinner'
import { apiConstants } from '../../AppConstants/constants'
import Cookies from 'js-cookie'
import './index.css'

const Login = () => {
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [apiStatus, setApiStatus] = useState(apiConstants.initial)
    // const [user, setUser] = useState({})
    const [errMsg, setErrMsg] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = Cookies.get('jwt_token')
        if (jwtToken !== undefined) {
            return navigate('/', {replace: true})
        }
    })

    // onAuthStateChanged(auth, (currentUser) => {
    //     setUser(currentUser)
    // })

    const loginUser = async () => {
        try {
            if (loginEmail !== "" && loginPassword !== "") {
                setApiStatus(apiConstants.inProgress)
                const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
                const userInfo = {
                    userId: user.user.uid,
                    operationType: user.operationType,
                }
                Cookies.set('jwt_token', user.user.accessToken, {expires: 1})
                localStorage.setItem('user_info', JSON.stringify(userInfo))
                localStorage.setItem('activeTab', 'TODO')
                setLoginEmail('')
                setLoginPassword('')
                navigate('/', {replace: true})
            } else {
                setErrMsg('*Username and password can not be empty!')
            }   
        } catch (error) {
            setApiStatus(apiConstants.success)
            if (error.message === 'Firebase: Error (auth/user-not-found).') {
                setErrMsg('*User Does not exists!')
            } else if (error.message === 'Firebase: Error (auth/wrong-password).') {
                setErrMsg('*Invalid password')
            } 
            else if (error.message === "Firebase: Error (auth/invalid-email).") {
                setErrMsg('*Invalid email!')
            } else if (error.message === 'Firebase: Error (auth/network-request-failed).') {
                setErrMsg('*You are offline. please check your network!')
            } else if (error.message === 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).') {
                setErrMsg('*Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later!')
            } else  {
                console.log(error.message)
                setErrMsg(error.message)
            }
        }
    }

    const toggleShowPassword = () => {
        setShowPassword((prev) => (!prev))
    }

    return (
        <div className="login-container">
            <div className='login-form'>
                <h2 className='login-form-title'>Sign in</h2>
                <div className='form-field'>
                    <input
                        className='login-form-input'
                        value={loginEmail}  
                        type='email'
                        placeholder='Email'
                        onChange={(event) => {setLoginEmail(event.target.value)}}
                    />
                    <MdEmail className="login-logo" />
                </div>
                <div className='form-field'>
                    <input
                        className='login-form-input'
                        value={loginPassword}
                        type={!showPassword ? 'password' : 'text'}
                        placeholder='Password'
                        onChange={(event) => {setLoginPassword(event.target.value)}}
                    />
                    <MdLock className="login-logo" />
                </div>
                <span className='forgot-password-text'><Link to="/forgot-password">Forgot password?</Link></span>
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
                {/* <button className='login-btn' onClick={loginUser}>Sign In</button> */}
                {apiStatus !== 'IN_PROGRESS' ? <button className='login-btn' onClick={loginUser}>Sign In</button> : (
                    <button className='login-btn progress'>
                        <ThreeDots height={40} width={50} radius={2} color="#fff" ariaLabel="ball-triangle-loading" visible={true} />
                    </button>
                )}
                
                {errMsg === '' ? null : (<p className='err-msg'>{errMsg}</p>)}
                <p className='have-acc-text'>Don't have an account? <Link to='/sign-up'>Sign Up</Link></p>
            </div>
            <img src="https://res.cloudinary.com/duzlefgz6/image/upload/Vectors_gvqpjm.png" alt="bg" className='login-bg' />
        </div>
    )
}

export default Login