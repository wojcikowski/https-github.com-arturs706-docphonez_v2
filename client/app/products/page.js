"use client";

import React from 'react'
import styles from './page.module.css'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import refreshToken from '../../checkCr';

export default function page() {
  const dispatch = useDispatch()

  useEffect(() => {
      async function checkRefreshToken() {
        await refreshToken(dispatch);
      }
      checkRefreshToken();
    }, []);


  return (
    <div className={styles.pagemain}>
      <h1>Products</h1>
    </div>
  )
}
