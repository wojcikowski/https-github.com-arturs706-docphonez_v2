"use client"
import styles from './page.module.css'
import Image from 'next/image'

export default function Page() {
  return (
    <div className={styles.main}>
      <div className={styles.ovalblurdyn}></div>
      <div className={styles.aboutus}>
        <h1>About Us</h1>
        </div>

      <div className={styles.imageContainer}>
        <Image 
          src="https://res.cloudinary.com/dttaprmbu/image/upload/v1681644295/892528ea0b493be57d9ac2170b8d7418.jpg"
          alt="Doctor Phonez"
          width={960}
          height={640}
          quality={100}
        />
      </div>
      <div className={styles.ourmission}>
      <h1>Our mission</h1>

      </div>

      <div className={styles.textContainer}>
        <h3>Welcome to Doctorphonez, your one-stop destination for all your mobile phone and accessory needs. We are a leading mobile phone retailer based in Ealing West London, dedicated to providing you with the latest and highest quality mobile phones and accessories at competitive prices.</h3>
      </div>
      <div className={styles.imageContainer}>
        <Image 
          src="https://res.cloudinary.com/dttaprmbu/image/upload/v1681646807/3728601189bd8ee1d00cd739dfa3cd98.webp"
          alt="Doctor Phonez"
          width={1500}
          height={750}
          quality={100}
        />
      </div>
      <div className={styles.textContainer}>
        <h3>Our mission at Doctorphonez is to make your shopping experience hassle-free, convenient, and enjoyable. We understand that your mobile phone is an essential part of your life, and we strive to provide you with the best products and services to keep your phone up and running.</h3>
      </div>
    </div>
  )
}
