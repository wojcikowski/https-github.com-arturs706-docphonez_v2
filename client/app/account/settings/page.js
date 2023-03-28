"use client"

import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setProfile, setEmailAdd, setUserRole, setTokenExp, clearProfile } from '../../../redux/reducers/profileSlice'
import Link from 'next/link';
import { clearCart } from '../../../redux/reducers/cartSlice';




export default function Page() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [profileToken, setProfileToken] = useState('');
    const [emailAdd, setEmailAdd] = useState('');
    const [userRole, setUserRole] = useState('');
    const [tokenExp, setTokenExp] = useState(false);
    const [user, setUser] = useState({
        fullname: "",
        email: "",
        mob_phone: ""});

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/refresh_token', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/refresh_token", {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.err === "jwt must be provided") {
            router.push('/account/login')
        } else {
            const { token, email, exp, role } = jwt_decode(data.accessToken)
            const isExpired = (exp * 1000) < new Date().getTime()
            fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/profile', {
            // fetch("https://pm.doctorphonez.co.uk/api/v1/profile", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` },
            })
            .then((res) => res.json())
            .then((userdata) => {
                setUser(userdata.data)
                setProfileToken(token)
                dispatch(setProfile(data.accessToken))
            })

        }
        
    })
}, [dispatch, router]);



    const logout = () => {
        fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/logout', {
        // fetch("https://pm.doctorphonez.co.uk/api/v1/logout", {
            method: "DELETE",
            credentials: 'include',
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${profileToken}` },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.message === "Logged out successfully") {
                dispatch(clearProfile())
                dispatch(clearCart())
                router.push('/')
            }
        })
    }


  return (
    <div className={styles.main}>
      <div className={styles.ovalblur}></div>
      <div className={styles.divleft}>
        <div className={styles.profileH}>Profile</div>

        <Link href="/account">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950884/etc/homeicon_xfx8h8.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>General</h5>
          </div>
        </Link>
        <Link href="/account/orders">
        <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950827/etc/delivery_xr7qev.svg" alt="icon" width={30} height={30} />
          <h5 className={styles.inactiveh5}>Orders</h5>
        </div>
        </Link>
        <Link href="/account/favourites">
          <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950827/etc/favourites_dwalys.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>Wishlist</h5>
          </div>
        </Link>
        <Link href="/account/deliveries">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950827/etc/deliveries_zzqyjk.svg"alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>Delivery Addresses</h5>
          </div>
        </Link>
        <Link href="/account/settings">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950789/etc/account_isgany.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.activeh5}>Account details</h5>
          </div>
        </Link>
      </div>
      <div className={styles.divright}>
        <div className={styles.logout}>Logout</div>
        <button className={styles.logout} onClick={logout}>x</button>
      </div>
    </div>
  );
}

