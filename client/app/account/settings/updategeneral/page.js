"use client"

import styles from './page.module.css'
import { useState, useEffect } from 'react'
import React from 'react'
import { useDispatch } from 'react-redux'
import refreshToken from '../../../../checkCr';
import { useRouter } from 'next/navigation';
import Button from '@/Button'


export default function Page() {
    const dispatch = useDispatch()
    const [isActive, setActive] = useState(false);

    const handleClick = () => {
        setActive(true);
        setTimeout(() => {
        setActive(false);
        }, 1000); // Set timeout to match animation duration
        }
        
    useEffect(() => {
        async function checkRefreshToken() {
          await refreshToken(dispatch);
        }
        checkRefreshToken();
      }, [dispatch]);
  return (
    <div className={styles.main}>
        <div className={styles.ovalblurtwo}></div>
        <div className={styles.changedivwrapper}>
            <h4>CHANGE THE GENERAL ACCOUNT DETAILS</h4>
            <div className={styles.changediv}>
                <label htmlFor="fullname">Full Name</label>
                <input type="text" name="fullname" id="fullname" />
                <div className={styles.mainwrapplabel}>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="dob">Date of Birth</label>
                        <input type="text" name="dob" id="dob" />
                    </div>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="gender">Gender</label>
                        <input type="text" name="gender" id="gender" />
                    </div>
                </div>
                <div className={styles.buttonwrapper}>
                <Button text = "Save Changes" onClick={handleClick} />
                </div>
            </div>

        </div>

    </div>
  )
}
