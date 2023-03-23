// "use client"

// import { useEffect, useState } from 'react'
// import styles from './page.module.css'
// import { useSelector, useDispatch } from 'react-redux'
// import { login, setIsAuth } from '/redux/reducers/loginSlice'
// import { useRouter } from 'next/navigation';
// import Image from 'next/image'
// import Link from 'next/link'



// export default function Page() {
//   const [email, setEmail] = useState('aradionovs@yahoo.com')
//   const [passwd, setPasswd] = useState('1')
//   const [confirmPasswd, setConfirmPasswd] = useState('1')
//   const dispatch = useDispatch()
//   const {isSuccess} = useSelector(state => state.login)
//   const router = useRouter()

  
//   //redirects user if login is successful
//   useEffect(() => {
//     if (isSuccess) {
//       dispatch(setIsAuth(true))
//     }
//   }, [isSuccess])

  
//   //submits login form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if(passwd !== confirmPasswd) {
//       alert('Passwords do not match')
//     } else {
//       const userData = {
//         email,
//         passwd
//       }
//       dispatch(login(userData))
//     }
//   }

//   const handleEmail = (e) => {
//     setEmail(e.target.value);
//     };
//   const handlePasswd = (e) => {
//     setPasswd(e.target.value);
//     };
//   const handleConfPasswd = (e) => {
//     setConfirmPasswd(e.target.value);
//     };


//   return (
//     <div className={styles.main}>
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <h1>Login Now</h1>
//         <label>Email address</label>
//         <input className={styles.emailinput} onChange={handleEmail} type="email" placeholder="Type your email" value={email}/>
//         <label>Password</label>
//         <input className={styles.password} onChange={handlePasswd} type="password" placeholder="Type your password" value={passwd} />
//         <label>Confirm Password</label>
//         <input className={styles.password} onChange={handleConfPasswd} type="password" placeholder="Confirm your password" value={confirmPasswd} />
//         <Link href="/account/recover"><h6>Forgot password?</h6></Link>
//         <button type="submit" className={styles.button}>Login</button>
//       </form>

//       <div className={styles.ovalblur}></div>
//     </div>
//   )
// }









"use client"

import { useEffect, useState } from 'react'
import styles from './page.module.css'
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import Loader from '../Loader'



export default function Page() {
  const [email, setEmail] = useState('aradionovs@yahoo.com')
  const [passwd, setPasswd] = useState('1')
  const [confirmPasswd, setConfirmPasswd] = useState('1')
  const router = useRouter()
  const [errormessage, setErrorMessage] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPasswd, setUserPasswd] = useState('')

  



  //submits login form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(passwd !== confirmPasswd) {
      alert('Passwords do not match')
    } else {
      try {
        const response = await axios.post('http://localhost:10000/api/v1/login', {
          email: email,
          passwd: passwd
        }, {
          withCredentials: true
        })
  
        if (response.data.status === 'success') {
          router.push('/account')
        }
      } catch (error) {
        if (error.response.data.message = "Please verify your email address") {
          setErrorMessage(error.response.data.message)
          setUserEmail(email)
          setUserPasswd(passwd)
        } else {
          setErrorMessage(error.response.data.message)
        }}

    }
  }


  const handleresendemail = async () => {
    console.log(userEmail, userPasswd)
    try {
      const response = await axios.post('http://localhost:10000/api/v1/resendemail', {
        email: userEmail,
        passwd: userPasswd
      }, {
        withCredentials: true
      })
      if (response.data.status === 'success') {
        setErrorMessage("New email sent")
        //redirect to login page after 5 seconds
        setTimeout(() => {
          router.push('/account/login')
        }, 5000)
        
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEmail = (e) => {
    setEmail(e.target.value);
    };
  const handlePasswd = (e) => {
    setPasswd(e.target.value);
    };
  const handleConfPasswd = (e) => {
    setConfirmPasswd(e.target.value);
    };

  if (errormessage) {
    return (
      <div className={styles.main}>
        
        <h1>{errormessage}</h1>
        <br />
        <button onClick={handleresendemail}>Resend Email</button>
      </div>
    )
  }


  return (
    <div className={styles.main}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Login Now</h1>
        <label>Email address</label>
        <input className={styles.emailinput} onChange={handleEmail} type="email" placeholder="Type your email" value={email}/>
        <label>Password</label>
        <input className={styles.password} onChange={handlePasswd} type="password" placeholder="Type your password" value={passwd} />
        <label>Confirm Password</label>
        <input className={styles.password} onChange={handleConfPasswd} type="password" placeholder="Confirm your password" value={confirmPasswd} />
        <Link href="/account/recover"><h6>Forgot password?</h6></Link>
        <button type="submit" className={styles.button}>Login</button>
      </form>

      <div className={styles.ovalblur}></div>
    </div>
  )
}



