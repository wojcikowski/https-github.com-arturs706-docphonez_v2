// "use client"


import styles from './page.module.css';
import axios from 'axios';
import Image from 'next/image';
import { cookies } from 'next/headers';


export default function Page() {

  const cookieStore = cookies();
  const token = cookieStore.get('refreshToken');
  const uservalue = token.value;
  //decode token and get user id
  const base64Url = uservalue.split('.')[1];
  console.log(base64Url);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:10000/api/v1/profile`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${uservalue}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  }
  
  fetchUser();

  
  return (
    <div className={styles.main}>
      <div className={styles.divleft}>
        <div className={styles.profileH}>Profile</div>
        <div className={styles.divwrap}>
          <Image src="/homeicon.svg" alt="icon" width={30} height={30} />
          <h5>General</h5>
        </div>
        <div className={styles.divwrap}>
          <Image src="/delivery.svg" alt="icon" width={30} height={30} />
          <h5>Orders</h5>
        </div>
        <div className={styles.divwrap}>
        <Image src="/favourites.svg" alt="icon" width={30} height={30} />
          <h5>Wishlist</h5>
        </div>
        <div className={styles.divwrap}>
          <Image src="/deliveries.svg"alt="icon" width={30} height={30} />
          <h5>Delivery Addresses</h5>
        </div>
        <div className={styles.divwrap}>
          <Image src="/account.svg" alt="icon" width={30} height={30} />
          <h5>Account details</h5>
        </div>
      </div>
      <div className={styles.divright}>
        <h1>Welcome</h1>
        <h2>Account Page</h2>
        <br />
        <div>Hey! This is where you can check out all your old orders, tell us what kind of emails you want to receive, and update your account deets to make checkout a breeze.</div>
      </div>

      {/* <div className={styles.form}>
        <div>User: {userGot}</div>
        <div>Role: {roleGot}</div>
        <div>Fullname: {fullname}</div>
        <div>Date of Birth: {dob}</div>
        <div>Email: {email}</div>
        <div>Phone: {phone}</div>
        <p>Is Authenticated: {isAuthGot ? 'Yes' : 'No'}</p>
      </div>
      <button onClick={handleLogout}>Logout</button> */}
    </div>
  );
}

