// "use client"


// import { useSelector } from 'react-redux';
// import { reset, setIsAuth } from '/redux/reducers/loginSlice';
// import styles from './page.module.css';
// import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
// import axios from 'axios';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import Loader from './Loader';

// export default function Page() {
//   const router = useRouter();
//   const { user, role, isAuth } = useSelector(state => state.login);
//   const [userGot, setuUserGot] = useState('');
//   const [roleGot, setRoleGot] = useState('');
//   const [isAuthGot, setIsAuthGot] = useState(false);
//   const dispatch = useDispatch();
//   const [fullname, setFullname] = useState('');
//   const [dob, setDob] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [isLoading, setIsLoading] = useState(true);


  

//   const handleLogout = () => {
//     dispatch(reset());
//     setIsAuthGot(false);
//     setuUserGot('');
//     setRoleGot('');
//     deleteCookie('isAuth');
//     deleteCookie('userisloggedin');
//     window.location.href = '/';
//   };

//   useEffect(() => {
//     setuUserGot(user);
//     setRoleGot(role);
//     setIsAuthGot(isAuth);
//   }, [user, role, isAuth]);

//   useEffect(() => {
//     if (hasCookie('userisloggedin')) {
//       const fetchUser = async () => {
//         try {
//           const res = await axios.get(`http://0.0.0.0:10000/api/v1/users/${user}`, {
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${getCookie('userisloggedin')}`
//             },
//           });
//           const { data } = res;
//           setFullname(data.user[0].fullname);
//           setDob(data.user[0].dob);
//           setEmail(data.user[0].email);
//           setPhone(data.user[0].mob_phone);
//           setIsLoading(false);
//         } catch (error) {
//           if (error.response.status === 401) {
//             handleLogout();
//           }
//         }
//       }
//       fetchUser();
//     }
//   }, [hasCookie, getCookie]);


//   useEffect(() => {
//     if (!isAuth) {
//       window.location.href = '/';
//     }
//   }, [isAuth]);

//   useEffect(() => {
//     try {
      
//     } catch (err) {
//       if (err.response.status === 401) {
//         console.log('Unauthorized');
//       }
//       if (err.response.status === 403) {
//         console.log('Forbidden');
//       }
//     }

//   }, [user]);

//   if (isLoading) {
//     return (
//       <div className={styles.main}>
//         <Loader />
//       </div>
//     )
//   } else {
  
//   return (
//     <div className={styles.main}>
//       <div className={styles.divleft}>
//         <div className={styles.profileH}>Profile</div>
//         <div className={styles.divwrap}>
//           <Image src="/homeicon.svg" alt="icon" width={30} height={30} />
//           <h5>General</h5>
//         </div>
//         <div className={styles.divwrap}>
//           <Image src="/delivery.svg" alt="icon" width={30} height={30} />
//           <h5>Orders</h5>
//         </div>
//         <div className={styles.divwrap}>
//         <Image src="/favourites.svg" alt="icon" width={30} height={30} />
//           <h5>Wishlist</h5>
//         </div>
//         <div className={styles.divwrap}>
//           <Image src="/deliveries.svg"alt="icon" width={30} height={30} />
//           <h5>Delivery Addresses</h5>
//         </div>
//         <div className={styles.divwrap}>
//           <Image src="/account.svg" alt="icon" width={30} height={30} />
//           <h5>Account details</h5>
//         </div>
//       </div>
//       <div className={styles.divright}>
//         <h1>Welcome {fullname.split(' ')[0]}!</h1>
//         <h2>Account Page</h2>
//         <br />
//         <div>Hey {fullname.split(' ')[0]}! This is where you can check out all your old orders, tell us what kind of emails you want to receive, and update your account deets to make checkout a breeze.</div>
//       </div>

//       {/* <div className={styles.form}>
//         <div>User: {userGot}</div>
//         <div>Role: {roleGot}</div>
//         <div>Fullname: {fullname}</div>
//         <div>Date of Birth: {dob}</div>
//         <div>Email: {email}</div>
//         <div>Phone: {phone}</div>
//         <p>Is Authenticated: {isAuthGot ? 'Yes' : 'No'}</p>
//       </div>
//       <button onClick={handleLogout}>Logout</button> */}
//     </div>
//   );
// }
// }

import React from 'react'
import axios from 'axios'
import { cookies } from 'next/headers';
import jwt_decode from 'jwt-decode';


export default function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken');
  // const decoded = jwt_decode(token.value);
  // console.log(decoded);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:10000/api/v1/profile`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.value}`
        }
      }).then(res => {
        console.log(res);
      }
      );

    } catch (error) {
      console.log(error);
    }
  }

  fetchUser();



  return (
    <div>page</div>
  )
}
