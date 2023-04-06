"use client"

import styles from './page.module.css'
import { useState, useEffect } from 'react'
import React from 'react'
import { useDispatch } from 'react-redux'
import refreshToken from '../../../../checkCr';
import { useRouter } from 'next/navigation';


export default function Page() {
    const dispatch = useDispatch()

    useEffect(() => {
        async function checkRefreshToken() {
          await refreshToken(dispatch);
        }
        checkRefreshToken();
      }, [dispatch]);
  return (
    <div className={styles.main}>
        <div className={styles.ovalblurtwo}></div>
    </div>
  )
}
