"use client"

import styles from './page.module.css'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import jwt_decode from 'jwt-decode'
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../../redux/reducers/profileSlice'
import Loader from '@/app/Loader'



export default function Page() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [profileToken, setProfileToken] = useState('');
    const [emailAdd, setEmailAdd] = useState('');
    const [userRole, setUserRole] = useState('');
    const [tokenExp, setTokenExp] = useState(false);
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
                    setProfileToken(token)
                    dispatch(setProfile(data.accessToken))
                    if (role !== "admin") {
                        router.push('/')
                    }
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
    }
    
  return (
    <div className={styles.main}>
    <div className={styles.ovalblurtwo}></div>
    Welcome to the protected route
    </div>
  )
}
