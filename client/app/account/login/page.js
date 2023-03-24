"use client"

import { useEffect, useState } from 'react'
import styles from './page.module.css'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import axios from 'axios'
import Loader from '../Loader'
import { useDispatch } from 'react-redux';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../redux/reducers/profileSlice'
import jwt_decode from "jwt-decode";
import { useSelector } from 'react-redux';


export default function Page() {
  const [email, setEmail] = useState('aradionovs@yahoo.com')
  const [passwd, setPasswd] = useState('1')
  const [confirmPasswd, setConfirmPasswd] = useState('1')
  const router = useRouter()
  const [errormessage, setErrorMessage] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPasswd, setUserPasswd] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showButton, setShowButton] = useState(true);
  const dispatch = useDispatch()
  const token = useSelector(state => state.profile)



  const handleSubmit = async (e) => {
    e.preventDefault();

    if(passwd !== confirmPasswd) {
      alert('Passwords do not match')
    } else {
      try {
        const response = await axios.post('http://localhost:10000/api/v1/login', {
          email: email,
          passwd: passwd
        }, {
          withCredentials: true
        })
  
        if (response.data.status === 'success') {
          const token = response.data.accessToken
          const { email, exp, role, id } = jwt_decode(token)
          dispatch(setProfile(token))
          dispatch(setEmailAdd(email))
          dispatch(setUserRole(role))
          //check if token is expired and return true or false
          const isExpired = (exp * 1000) < new Date().getTime()
          dispatch(setTokenExp(isExpired))

          router.push('/account')
        }
      } catch (error) {
        if (error && error.response && error.response.data && error.response.data.message === "Please verify your email address") {
          setErrorMessage(error.response.data.message)
          setUserEmail(email)
          setUserPasswd(passwd)
        } else {
          setErrorMessage(error.message)
        }}
        
    }
  }


  const handleresendemail = async () => {
    try {
      const response = await axios.post('http://localhost:10000/api/v1/resendemail', {
        email: userEmail,
        passwd: userPasswd
      }, {
        withCredentials: true
      })
      if (response.data.status === 'success') {
        setIsLoading(true)
        setErrorMessage('Email sent successfully')
        setShowButton(false); // hide the button
        setTimeout(() => {
          router.push('/')
        }, 3000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  
  const handleEmail = (e) => {
    setEmail(e.target.value);
    };
  const handlePasswd = (e) => {
    setPasswd(e.target.value);
    };
  const handleConfPasswd = (e) => {
    setConfirmPasswd(e.target.value);
    };

  if (errormessage) {
    return (
      <div className={styles.main}>
        {errormessage && (
          <h1>{errormessage}</h1>
        )}
        {showButton && errormessage && (
          <button className={styles.check} onClick={handleresendemail}>Resend Email</button>
        )}
      </div>
    );
  }


  return (
    <div className={styles.main}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Login Now</h1>
        <label>Email address</label>
        <input className={styles.emailinput} onChange={handleEmail} type="email" placeholder="Type your email" value={email}/>
        <label>Password</label>
        <input className={styles.password} onChange={handlePasswd} type="password" placeholder="Type your password" value={passwd} />
        <label>Confirm Password</label>
        <input className={styles.password} onChange={handleConfPasswd} type="password" placeholder="Confirm your password" value={confirmPasswd} />
        <Link href="/account/recover"><h6>Forgot password?</h6></Link>

        <button type="submit" className={styles.button}>Login</button>
        <div className={styles.notamember}>
          <h5>Not a member?</h5>
          <Link href="/account/register" className={styles.signupp}><h5>Signup</h5></Link>
        </div>

      </form>

      <div className={styles.ovalblur}></div>
    </div>
  )
}



