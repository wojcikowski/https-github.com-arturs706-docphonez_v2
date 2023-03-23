"use client"

import styles from './sectiontwo.module.css'
import Image from 'next/image'


export default function Sectiontwo(props) {
const sectionTwoRef = props.sectionthreeref;
const handleClick = () => {
    sectionTwoRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    };
    
    
  return (
    <main className={styles.sectiontwo}>
        <div className={styles.sectiontwodiv}>
          <h1>IPHONE 14 PRO MAX</h1>
          <Image
              src="https://res.cloudinary.com/dttaprmbu/image/upload/v1678030287/arrowdown_xtrut2.svg"
              alt="arrow-down"
              width={200}
              height={148}
              className={styles.rotateonhover} // add a class to trigger the rotation on hover
              onClick={handleClick}
          />
        </div>
        <div className={styles.ovalblurtwo}></div>
    </main>
  )
}
