
"use client"

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import React from 'react'
import { useDispatch } from 'react-redux'
import refreshToken from '../../../checkCr';
import { useRouter } from 'next/navigation';

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
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
      async function checkRefreshToken() {
        await refreshToken(dispatch);
      }
      checkRefreshToken();
    }, [dispatch]);
    
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(passwd !== confirmPasswd || email !== confirmEmail) {
      alert('Passwords or emails do not match')
    } else {
      console.log(fullname, dob, gender, mobPhone, confirmEmail, setConfirmPasswd)
      // fetch(`http://localhost:10000/api/v1/register` , {
      fetch(`https://pm.doctorphonez.co.uk/api/v1/register` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fullname: fullname,
            dob: dob,
            gender: gender,
            mob_phone: mobPhone,
            email: confirmEmail,
            passwd: confirmPasswd
        })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {
                setMessage(data.message)
                //redirect to login page after 3 seconds
                setTimeout(() => {
                    router.push('/account/login')
                }, 3000)

            } else {
                setMessage(data.message)
            }
        })
        .catch((err) => {
            console.log(err)
        })
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

    if (message) {
    return (
      <div className={styles.main}>
        <h1>{message}</h1>
      </div>
    )
    }

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