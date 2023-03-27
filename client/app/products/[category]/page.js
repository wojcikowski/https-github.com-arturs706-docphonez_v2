'use client'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../redux/reducers/profileSlice'
import refreshToken from '../../../checkCr';

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
        await refreshToken(dispatch);
      }
      checkRefreshToken();
    }, [dispatch]);

  useEffect(() => {
    setLoading(true)
      // fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/products/${categorysplit}`)
      fetch("https://pm.doctorphonez.co.uk/api/v1/products/" + categorysplit)
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