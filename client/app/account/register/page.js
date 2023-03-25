
"use client"

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { register, reset } from '/redux/reducers/authSlice'
import refreshToken from '../../../checkCr';

export default function Page() {
  const [fullname, setFullname] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [mobPhone, setMobPhone] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('aradionovs@yahoo.com')
  const [passwd, setPasswd] = useState('')
  const [confirmPasswd, setConfirmPasswd] = useState('1')
  const dispatch = useDispatch()

  useEffect(() => {
      async function checkRefreshToken() {
        await refreshToken(dispatch);
      }
      checkRefreshToken();
    }, []);
  const { isLoading, isError, isSuccess, message} = useSelector(state => state.auth)
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(passwd !== confirmPasswd || email !== confirmEmail) {
      alert('Passwords or emails do not match')
    } else {
      const userData = {
        fullname,
        dob,
        gender,
        mob_phone: mobPhone,
        email,
        passwd
      }
      dispatch(register(userData))
    }
  }

    const handleName = (e) => {
    setFullname(e.target.value);
    };
  const handleDob = (e) => {
    setDob(e.target.value);
    };
  const handleGender = (e) => {
    setGender(e.target.value);
    };
  const handleMobPhone = (e) => {
    setMobPhone(e.target.value);
    };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    };
  const handleConfirmEmail = (e) => {
    setConfirmEmail(e.target.value);
    };
  const handlePasswd = (e) => {
    setPasswd(e.target.value);
    };
  
  const handleConfirmPasswd = (e) => {
    setConfirmPasswd(e.target.value);
    };

  return (
    <div className={styles.main}>
      <h1>Register Now</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input onChange={handleName} type="text" placeholder="Full Name" value={fullname}  />
        <input onChange={handleDob} type="text" placeholder="Date of Birth" value={dob}  />
        <input onChange={handleGender} type="text" placeholder="Gender" value={gender} />
        <input onChange={handleMobPhone} type="text" placeholder="Mobile Phone" value={mobPhone} />
        <input onChange={handleEmail} type="email" placeholder="Email" value={email}/>
        <input onChange={handleConfirmEmail} type="email" placeholder="Confirm Email" value={confirmEmail} />
        <input onChange={handlePasswd} type="Password" placeholder="Password" value={passwd} />
        <input onChange={handleConfirmPasswd} type="Password" placeholder="Confirm Password" value={confirmPasswd} />
        <button className={styles.button} type="submit">Register</button>
        
      </form>
      <div className={styles.ovalblur}></div>
    </div>
  )
}