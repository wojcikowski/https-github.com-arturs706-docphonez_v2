"use client"; // this is a client component 👈🏽

import styles from './cartpage.module.css'
import { useState, useEffect } from 'react'
import { removeFromCart, incrementQuantity, decrementQuantity } from '../../redux/reducers/cartSlice'
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../redux/reducers/profileSlice'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import jwt_decode from "jwt-decode";

export default function Page() {
    const cart = useSelector(state => state.counter);
    const [totalItems, setTotalItems] = useState(0)
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const dispatch = useDispatch()
    const [message, setMessage] = useState('')

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
        const dataRetrieve = cart.map((item) => {
            return {
                prodname: item.prodname,
                quantity: item.quantity,
                price: item.price,
                productimage: item.imagetwo,
            }
        })
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalItems(totalItems);
        setData(dataRetrieve)
        setTotal(total)
        if (totalItems === 0) {
            setMessage('Your cart is empty')
        }
    }, [cart])




    const handleProductAdd = (prodname) => {
        dispatch(incrementQuantity(prodname))
    }
    const handleProductDecrement = (prodname) => {
        dispatch(decrementQuantity(prodname))
    }
    const handleProductRemove = (prodname) => {
        dispatch(removeFromCart(prodname))
    }

    //create a function to format the price to 2 decimal places
    const formatPrice = (price) => {
        return price.toFixed(2)
    }


    return (
        <div className={styles.cartmain}>
            <div className={styles.cartpage}>
            <div className={styles.wrapppline}>
                <h4>Description</h4>
                <h4>Name</h4>
                <h4>Quantity</h4>
                <h4>Remove</h4>
                <h4>Price</h4>
            </div>

            <div className={styles.ovalblur}></div>
            <div className={styles.ovalblurtow}></div>


                {data.map((item, index) => (
                    
                    <div key={index} className={styles.cartitem}>
                        <Image 
                            src = {item.productimage}
                            alt = {item.prodname}
                            width = {100}
                            height = {100}
                        />
                        <div className={styles.prodnamewraps}>
                            <h4>{item.prodname}</h4>
                        </div>
                        
                        <div className={styles.addminu} onClick={() => handleProductDecrement(item.prodname)}>-</div>

                        <div className={styles.qty}><h4>{item.quantity}</h4></div>
                        <div className={styles.addminu} onClick={() => handleProductAdd(item.prodname)}>+</div>
                        <div className={styles.exempt} onClick={() => handleProductRemove(item.prodname)}>x</div>
                        <div><h4>£{item.price}</h4></div>
                        <div className={styles.exempt} ><h4>£{formatPrice(item.price * item.quantity)}</h4></div>

                    </div>
                ))}
            </div>
            {
                message 
                ? 
                <>
                <h1>{message}</h1>
                <Link href="/"><button className={styles.button}>Continue Shopping</button></Link>
                </>
                : 
                <>
                    <div><h1>£{formatPrice(total)}</h1></div>
                    <Link href="/checkout"><button className={styles.button}>Pay</button></Link>
                </>
            }
            

        </div>
    )
}
