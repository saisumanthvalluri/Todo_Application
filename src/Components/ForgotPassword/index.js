import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../Firebase-config'
import { BsCheck2 } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import './index.css'


const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [successStatus, setSuccessStatus] = useState(false)
    const navigate = useNavigate();
    const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

    useEffect(() => {
        const jwtToken = Cookies.get('jwt_token')
        if (jwtToken !== undefined) {
            return navigate('/', {replace: true})
        }
    })

    const onResetPassword = async () => {
        try {
            if (email !== '' && isEmail) {
                await sendPasswordResetEmail(auth, email)
                setErrMsg('*Reset password link sent to your mail successfully!')
                setSuccessStatus(true)
            } else if (!isEmail) {
                setErrMsg('*Invalid email!')
            } else {
                setErrMsg('*Email can not be empty!')
            }
        } catch (error) {
            if (error.message === 'Firebase: Error (auth/user-not-found).') {
                setErrMsg('*user not found or user deleted!')
            } else if (error.message === 'Firebase: Error (auth/network-request-failed).') {
                setErrMsg('*You are offline. please check your network!')
            } else {
                console.log(error.message)
                setErrMsg(error.message)
            }
        }
    }

    return(
        <div className="forgot-password-container">
            {successStatus ? (
                <div className='password-reset-link-sent-success-box'>
                    <div className='tick-icon-box'>
                        <BsCheck2 className='tick-icon' />
                    </div>
                    <h1 className='success-text'>Success!</h1>
                    <p className='success-msg'>Password reset request was sent successfully. Please check your email to reset your password!</p>
                    <Link to='/login'><button className='sign-in-redirect-btn'>Sign in</button></Link> 
                </div>
            ) : (
                <div className='forgot-password-form'>
                    <h2 className='forgot-password-form-title'>Forgot Password</h2>
                    <div className='form-field'>
                        <input
                            className='forgot-password-form-input'
                            value={email}
                            type='email'
                            placeholder='Email'
                            onChange={(event) => {setEmail(event.target.value)}}
                        />
                        <MdEmail className="forgot-password-logo" />
                    </div>
                    <button className='forgot-password-btn' onClick={onResetPassword}>Reset Password</button>
                    {errMsg !== "" && <p className='err-msg'>{errMsg}</p>}
                    <p className='seper-line'>--------------------------- OR ---------------------------</p>
                    <Link to='/login'><button className='sign-in-redirect-btn'>Sign in</button></Link>
                </div>
            )}
            <img src="https://res.cloudinary.com/duzlefgz6/image/upload/Vectors_gvqpjm.png" alt="bg" className='forgot-password-bg' />
        </div>
    )
}

export default ForgotPassword