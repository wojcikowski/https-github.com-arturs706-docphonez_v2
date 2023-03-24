"use client"

import styles from './page.module.css';
import axios from 'axios';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../redux/reducers/profileSlice'
import jwt_decode from "jwt-decode";

export default function Page() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.profile.token);
  // const tokenExp = useSelector(state => state.profile.tokenExp);

//middleware to check if token is expired and refresh it
  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (await fetch('http://localhost:10000/api/v1/refresh_token', {
        method: 'POST',
        credentials: 'include', // Needed to include the cookie
        headers: {
          'Content-Type': 'application/json',
        }
      })).json();
        console.log(result.accessToken)
        const { email, exp, role } = jwt_decode(result.accessToken)
        dispatch(setProfile(result.accessToken))
        dispatch(setEmailAdd(email))
        dispatch(setUserRole(role))
        const isExpired = (exp * 1000) < new Date().getTime()
        dispatch(setTokenExp(isExpired))
    }
    checkRefreshToken();
  }, []);






  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:10000/api/v1/profile`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (error) {
      console.log(error.data);
    }
  }
  
  fetchUser();

  
  return (
    <div className={styles.main}>
      <div className={styles.divleft}>
        <div className={styles.profileH}>Profile</div>
        <div className={styles.divwrap}>
          <Image src="/homeicon.svg" alt="icon" width={30} height={30} />
          <h5>General</h5>
        </div>
        <div className={styles.divwrap}>
          <Image src="/delivery.svg" alt="icon" width={30} height={30} />
          <h5>Orders</h5>
        </div>
        <div className={styles.divwrap}>
        <Image src="/favourites.svg" alt="icon" width={30} height={30} />
          <h5>Wishlist</h5>
        </div>
        <div className={styles.divwrap}>
          <Image src="/deliveries.svg"alt="icon" width={30} height={30} />
          <h5>Delivery Addresses</h5>
        </div>
        <div className={styles.divwrap}>
          <Image src="/account.svg" alt="icon" width={30} height={30} />
          <h5>Account details</h5>
        </div>
      </div>
      <div className={styles.divright}>
        <h1>Welcome</h1>
        <h2>Account Page</h2>
        <br />
        <div>Hey! This is where you can check out all your old orders, tell us what kind of emails you want to receive, and update your account deets to make checkout a breeze.</div>
      </div>
    </div>
  );
}

