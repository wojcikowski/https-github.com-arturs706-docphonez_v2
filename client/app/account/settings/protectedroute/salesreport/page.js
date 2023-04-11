"use client"

import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setProfile } from '../../../../../redux/reducers/profileSlice'
import Link from 'next/link';
import Loader from '@/app/Loader'


export default function Page() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [roleCheck, setRoleCheck] = useState(false)


    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({
        fullname: "",
        email: "",
        mob_phone: ""});


  useEffect(() => {
    setLoading(true)
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
                dispatch(setProfile(data.accessToken))
                if (role !== "admin") {
                    router.push('/')
                }
                setRoleCheck(role)
                setLoading(false)
            })

        }
        
    })
}, [dispatch, router]);

if (loading) {
    return (
        <div className={styles.main}>
            <div className={styles.ovalblurtwo}></div>
            <Loader/>
        </div>
    )
} else if (roleCheck === "admin" && !loading) {

  return (
    <div className={styles.main}>
      <div className={styles.ovalblur}></div>
      <div className={styles.divleft}>
        <div className={styles.profileH}>Admin</div>

        <Link href="/account/settings/protectedroute">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950884/etc/homeicon_xfx8h8.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>General</h5>
          </div>
        </Link>
        <Link href="/account/settings/protectedroute/allorders">
        <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950827/etc/delivery_xr7qev.svg" alt="icon" width={30} height={30} />
          <h5 className={styles.inactiveh5}>All Orders</h5>
        </div>
        </Link>
        <Link href="/account/settings/protectedroute/allusers">
          <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950789/etc/account_isgany.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>All Users</h5>
          </div>
        </Link>
        <Link href="/account/settings/protectedroute/addproduct">
          <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1680857485/etc/f3f7ec5a3ff37407cec506b786e72c7e.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>Add product</h5>
          </div>
        </Link>
        <Link href="/account/settings/protectedroute/salesreport">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1680858086/etc/526231ade32fbcfb19048d8156ff5337.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.activeh5}>Sales report</h5>
          </div>
        </Link>
      </div>
      <div className={styles.divright}>
        <h1>Sales page</h1>
        <br />
        <br />
         <h2>Sales report</h2>
        <br />
        <br />
        <div className={styles.messagerightdiv}>Check sales</div>

        <div className={styles.divwrpp}>
          
        </div>

      </div>
    </div>
  );
}
}

