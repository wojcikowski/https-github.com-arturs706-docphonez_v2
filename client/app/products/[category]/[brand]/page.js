'use client'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import refreshToken from '../../../../checkCr'
import { useDispatch } from 'react-redux';

export default function Home() {
  const pathname = usePathname();
  const [dataretrvieved, setDataretrvieved] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const brand = pathname.split("/")[3]
  const categorysplit = pathname.split("/")[2]
  const dispatch = useDispatch()

  useEffect(() => {
      async function checkRefreshToken() {
        await refreshToken(dispatch);
      }
      checkRefreshToken();
    }, [dispatch]);

  useEffect(() => {
    setLoading(true)
      // fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/products/${categorysplit}/${brand}`)
      fetch("https://pm.doctorphonez.co.uk/api/v1/products/" + categorysplit + "/" + brand)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setDataretrvieved(data)
        setLoading(false)
      })
    
  }, [categorysplit, brand]) 

  if (isLoading) return <div className={styles.pagemaindyn}>Loading...</div>
  if (!dataretrvieved) return <div className={styles.pagemaindyn}>No data</div>
  
  if (dataretrvieved.status === "success") {

    return (
      <div className={styles.pagemaindyn}>
       <h1>Category And Brand</h1>
      </div>
    )
  }
}