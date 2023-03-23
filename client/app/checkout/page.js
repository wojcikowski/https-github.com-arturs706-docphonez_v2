"use client"; // this is a client component 👈🏽

import { useEffect, useState } from 'react'
import styles from './checkout.module.css'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'
import { useSelector } from 'react-redux'
import { getCookie, hasCookie } from 'cookies-next';
import axios from 'axios';


const stripePromise = loadStripe("pk_test_51MfhShFrvj0XKeq0C4CoNcKSCcHgBSOKzDZBIkNmuoNdtwRifkT6Y7Nl9Ky53fABvIC2A2kqIb0sFNhZ9xUCspT600lW4FNBcc");

export default function Page() {
    const [clientSecret, setClientSecret] = useState("");
    const cart = useSelector(state => state.counter)
    const { user } = useSelector(state => state.login);
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    // const newCart = cart.map(item => ({
    //   prodname: item.prodname,
    //   quantity: item.quantity,
    //   price: item.price,
    //   totalPrice: item.quantity * item.price
    // }));
    // console.log(newCart)
    


    useEffect(() => {
      if (hasCookie('userisloggedin')) {
        const fetchUser = async () => {
          try {
            const res = await axios.get(`http://0.0.0.0:10000/api/v1/users/${user}`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getCookie('userisloggedin')}`
              },
            });
            const { data } = res;
            setFullname(data.user[0].fullname);
            setEmail(data.user[0].email);
            setPhone(data.user[0].phone);
    
            const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
            console.log(email, fullname, phone, total)
            fetch("https://pm.doctorphonez.co.uk/api/v1/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: total,
              email: data.user[0].email,
              fullname: data.user[0].fullname,
              phone: data.user[0].phone
            }),
          })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
          } catch (error) {
            console.error(error);
          }
        }
        fetchUser();
      } else {
        window.location.href = '/account/login';
      }
    }, [user, cart]);
    



      const appearance = {
        theme: 'night',
        variables: {
          colorPrimary: '#000235',
          colorBackground: '#ffffff',
          colorText: '#000235',
        },
      };
      const options = {
        clientSecret,
        appearance,
      };

    return (
        <div className={styles.checkoutmain}>
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </div>
      )
}
