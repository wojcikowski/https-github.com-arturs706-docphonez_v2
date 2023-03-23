"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import styles from './page.module.css'

export default function Page() {
    const pathname = usePathname();
    const tokenSplit = pathname.split("/")[3]
    console.log(tokenSplit)
    const [dataretrvieved, setDataretrvieved] = useState(null)
    const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    //fetch data from api using PUT method
      fetch(`http://localhost:10000/api/v1/register/${tokenSplit}` , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
        })
        .then((res) => res.json())
        .then((data) => {
            setDataretrvieved(data)
            setLoading(false)
        })
        .catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }, [tokenSplit])

    
    console.log(dataretrvieved)
    if (isLoading) return <div className={styles.main}><p>Loading...</p></div>
    if (!dataretrvieved) return <div className={styles.main}><p>No profile data</p></div>

    if (dataretrvieved.status === "success") {
        return (
        <div className={styles.main}>Reg success</div>
        )
    }
    if (dataretrvieved.message === "Token expired") {
        return (
            <div className={styles.main}>Token expired</div>
        )
    }
    if (dataretrvieved.message === "InvalidToken") {
        return (
            <div className={styles.main}>Invalid Token</div>
        )
    }

}