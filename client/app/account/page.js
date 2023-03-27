"use client"

import styles from './page.module.css';
import axios from 'axios';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import refreshToken from '../../checkCr';

export default function Page() {
  const token = useSelector(state => state.profile.token);
  const dispatch = useDispatch()
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: ""});

  useEffect(() => {
      async function checkRefreshToken() {
        await refreshToken(dispatch);
      }
      checkRefreshToken();
    }, [dispatch]);



    useEffect(() => {
      async function fetchUser() {
        try {
            // const dataretr = await axios.get(process.env.NEXT_PUBLIC_API_URL + "api/v1/profile", {
              const dataretr = await axios.get("https://pm.doctorphonez.co.uk/api/v1/profile", {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          setUser(dataretr.data.data);
        } catch (error) {
          console.log(error.data);
        }
      }
      fetchUser();
    }, [token]);



  return (
    <div className={styles.main}>
      <div className={styles.ovalblur}></div>
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
        <h1>Welcome {user.fullname}</h1>
        <h2>Account Page</h2>
        <br />
        <div>Hey! This is where you can check out all your old orders, tell us what kind of emails you want to receive, and update your account deets to make checkout a breeze.</div>
      </div>
    </div>
  );
}

