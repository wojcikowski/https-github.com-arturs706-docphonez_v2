"use client";

import React from 'react'
import styles from './page.module.css'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import refreshToken from '../../../checkCr'

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
      <h1>Recover</h1>
    </div>
  )
}
