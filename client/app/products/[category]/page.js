'use client'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../redux/reducers/profileSlice'

export default function Home() {
  const category = usePathname();
  const [dataretrvieved, setDataretrvieved] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const categorysplit = category.split("/")[2]
  const brand = category.split("/")[3]
  const id = category.split("/")[4]
  const dispatch = useDispatch()



  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (await fetch('http://localhost:10000/api/v1/refresh_token', {
        method: 'POST',
        credentials: 'include', // Needed to include the cookie
        headers: {
          'Content-Type': 'application/json',
        }
      })).json();
      if (result.err !== "jwt must be provided")
      {
        const { email, exp, role } = jwt_decode(result.accessToken)
        dispatch(setProfile(result.accessToken))
        dispatch(setEmailAdd(email))
        dispatch(setUserRole(role))
        const isExpired = (exp * 1000) < new Date().getTime()
        dispatch(setTokenExp(isExpired))
      }
    }
    checkRefreshToken();
  }, []);
  

  useEffect(() => {
    setLoading(true)
    //fetch data from api using a dynamic path
      fetch(`http://localhost:10000/api/v1/products/${categorysplit}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setDataretrvieved(data)
        setLoading(false)
      })
    
  }, [categorysplit, brand, id]) 

  if (isLoading) return <div className={styles.pagemaindyn}>Loading...</div>
  if (!dataretrvieved) return <div className={styles.pagemaindyn}>No data</div>
  
  if (dataretrvieved.status === "success") {

    return (
      <div className={styles.pagemaindyn}>
        <h1>Category</h1>
      </div>

    )
  }
}