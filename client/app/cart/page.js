"use client"; // this is a client component 👈🏽

import styles from './cartpage.module.css'
import { useState, useEffect } from 'react'
import { removeFromCart, incrementQuantity, decrementQuantity } from '../../redux/reducers/cartSlice'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import refreshToken from '../../checkCr';
import { useRouter } from 'next/navigation';


export default function Page() {
    const cart = useSelector(state => state.counter);
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const router = useRouter()


    const handleClick = () => {
        router.push('/payment');
      };
    

    useEffect(() => {
        async function checkRefreshToken() {
          await refreshToken(dispatch);
        }
        checkRefreshToken();
      }, [dispatch]);

      //create a function that returns user back to the previous page when they click on the back button
        const handleBack = () => {
            router.back();
        }

    //create a function that returns no items in the cart when the cart is empty
    useEffect(() => {
        if (cart.length === 0) {
            setMessage('No items in cart')
        }
    }, [cart])



      function printFifthDay() {
        const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const today = new Date();
        const fifthDay = new Date(today);
        fifthDay.setDate(today.getDate() + 5);

        const date = fifthDay.getDate();
        const suffix = date === 11 || date === 12 || date === 13 ? 'th' : (date % 10 === 1 ? 'st' : (date % 10 === 2 ? 'nd' : (date % 10 === 3 ? 'rd' : 'th')));
      
        const monthOfYear = monthsOfYear[fifthDay.getMonth()];
      
        return `Arrives by ${date}${suffix} of ${monthOfYear}`;
      }
      
      

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

    if (message) {
        return (
            <div className={styles.cartmainnoprod}>
                <div className={styles.ovalblur}></div>
                <h1>No items within the card</h1>
                <div className={styles.backbutton} onClick={handleBack}>Back</div>
            </div>
        )
    }



    return (
        <div className={styles.cartmain}>
            <div className={styles.ovalblur}></div>
            <div className={styles.top}>
                <div className={styles.wrapp}>
                    <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679916575/etc/arrowgrad_acndpe.svg"
                        alt = "arrowgrad"
                        width = {40}
                        height = {40}
                        onClick = {handleBack}
                        priority = {true}
                    />
                    <h1>Checkout</h1>
                </div>
                <div className={styles.links}>
                    <h5>Homepage&nbsp;/&nbsp;</h5>
                    <h5>Products&nbsp;/&nbsp;</h5>
                    <h5 className={styles.checkoutpg}>Checkout</h5>
                </div>
            </div>
            <div className={styles.divwrapper}>
                <div className={styles.divleft}>
                    <div className={styles.stepper}>
                        <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/1_eimweq.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                            priority = {true}

                        />
                        <div className={styles.nameof}>Delivery</div>
                        </div>
                        <Image
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/inactive_pdvuzq.svg"
                            alt = "2"
                            width = {100}
                            height = {60}
                            priority = {true}

                        />
                        
                        <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/middle_vsveth.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                            priority = {true}

                        />
                        <div className={styles.nameoftow}>Payment</div>
                        </div>
                        <Image
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/inactive_pdvuzq.svg"
                            alt = "2"
                            width = {100}
                            height = {60}
                            priority = {true}

                        />
                       <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855140/etc/last_ftbbl0.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                            priority = {true}

                        />
                        <div className={styles.nameofthree}>Confirmation</div>
                        </div>
                    </div>
                    <div className={styles.cartpage}>
                        <h2>Contact Information</h2>
                        <div className={styles.form}>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>First Name</label>
                                <input type="text" placeholder="First Name"/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Last Name</label>
                                <input type="text" placeholder="Last Name"/>
                            </div>
                            </div>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>Email address</label>
                                <input type="email" placeholder="Email address"/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Mobile phone</label>
                                <input type="number" placeholder="Mobile phone"/>
                            </div>
                            </div>
                  

                        </div>
                        
                    </div>
                    <div className={styles.cartpage}>
                        <h2>Delivery Information</h2>
                        <div className={styles.form}>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>First line of the address</label>
                                <input type="text" placeholder="First line of the address"/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Second line of the address</label>
                                <input type="text" placeholder="Second line of the address"/>
                            </div>
                            </div>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>City</label>
                                <input type="text" placeholder="City"/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Post code</label>
                                <input type="text" placeholder="Post code"/>
                            </div>
                            </div>
                  

                        </div>
                        
                    </div>
                    <button className={styles.btn} onClick={handleClick}>Proceed to Payment</button>
                </div>

                <div className={styles.divright}>
                <div className={styles.divleftsmallsize}>
                    <div className={styles.stepper}>
                        <div className={styles.imgwrap}>
                        <Image 
                            src = "1.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                        />
                        <div className={styles.nameof}>Delivery</div>
                        </div>
                        <Image
                            src = "inactive.svg"
                            alt = "2"
                            width = {100}
                            height = {60}
                        />
                        
                        <div className={styles.imgwrap}>
                        <Image 
                            src = "middle.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                        />
                        <div className={styles.nameoftow}>Payment</div>
                        </div>
                        <Image
                            src = "inactive.svg"
                            alt = "2"
                            width = {100}
                            height = {60}
                        />
                       <div className={styles.imgwrap}>
                        <Image 
                            src = "last.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                        />
                        <div className={styles.nameofthree}>Confirmation</div>
                        </div>
                    </div>

                    <div className={styles.cartpage}>
                        <h2>Contact Information</h2>
                        <div className={styles.form}>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>First Name</label>
                                <input type="text" placeholder="First Name"/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Last Name</label>
                                <input type="text" placeholder="Last Name"/>
                            </div>
                            </div>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>Email address</label>
                                <input type="email" placeholder="Email address"/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Mobile phone</label>
                                <input type="number" placeholder="Mobile phone"/>
                            </div>
                            </div>
                  

                        </div>
                        
                    </div>
                    <div className={styles.cartpage}>
                        <h2>Delivery Information</h2>
                        <div className={styles.form}>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>First line of the address</label>
                                <input type="text" placeholder="First line of the address"/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Second line of the address</label>
                                <input type="text" placeholder="Second line of the address"/>
                            </div>
                            </div>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>City</label>
                                <input type="text" placeholder="City"/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Post code</label>
                                <input type="text" placeholder="Post code"/>
                            </div>
                            </div>
                  

                        </div>
                        
                    </div>









                    
                  
                </div>







                    <h2 className={styles.tiyle}>Your order</h2>
                    <div className={styles.productwrapp}>
                    {data.map((item, index) => (
        
                    <div key={index} >
                        <div className={styles.binwrapp}>
                        <h4>{item.prodname}</h4>
                        <Image
                            src = "bin.svg"
                            alt = "bin"
                            width = {20}
                            height = {20}
                            onClick={() => handleProductRemove(item.prodname)}
                        />

                        </div>
                        <Image 
                            src = {item.productimage}
                            alt = {item.prodname}
                            width = {90}
                            height = {100}
                        />
                       
                        <div className={styles.quantity}>
                        <h4>Quantity</h4>
                        <div className={styles.itemqtywrap}>
                            <div className={styles.addremoveitm} onClick={() => handleProductDecrement(item.prodname)}>-</div>
                            <div ><h4>{item.quantity}</h4></div>
                            <div className={styles.addremoveitm} onClick={() => handleProductAdd(item.prodname)}>+</div>
                        </div>
                       
                        <div><h3>£{formatPrice(item.price * item.quantity)}</h3></div>

                        </div>
                    </div>
                ))}
                    </div>
                    <div className={styles.total}>
                        <div className={styles.totalline}>
                            <div>Subtotal</div>
                            <div><h3>£{formatPrice(total*0.8)}</h3></div>
                        </div>
                        <div className={styles.totalline}>
                            <div>Shipping</div>
                            <div><h3>£{formatPrice(0)}</h3></div>
                        </div>
                        <div className={styles.totalline}>
                            <div>Tax</div>
                            <div><h3>£{formatPrice(total*0.2)}</h3></div>
                        </div>
                        <div className={styles.totalline}>
                            <h2>Total</h2>
                            <div><h2>£{formatPrice(total)}</h2></div>
                        </div>
                        <div className={styles.btntwo}>
                            <Image
                                src = "vehilce.svg"
                                alt = "delivery"
                                width = {20}
                                height = {20}
                            />

                            <h5>{printFifthDay()}</h5>
                        </div>
                        <button className={styles.btn} onClick={handleClick}>Proceed to Payment</button>

                    </div>
  


                </div>
            </div>
        </div>
    )
}

