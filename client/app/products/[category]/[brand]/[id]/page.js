'use client'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../../../redux/reducers/cartSlice'
import Loader from './Loader';
import refreshToken from '../../../../../checkCr';


export default function Home() {
  const dispatch = useDispatch()

  useEffect(() => {
      async function checkRefreshToken() {
        await refreshToken(dispatch);
      }
      checkRefreshToken();
    }, [dispatch]);

  const category = usePathname();
  const [dataretrvieved, setDataretrvieved] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const categorysplit = category.split("/")[2]
  const brand = category.split("/")[3]
  const id = category.split("/")[4]
  useEffect(() => {
    setLoading(true)
      // fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/products/${categorysplit}/${brand}/${id}`)
      fetch(`https://pm.doctorphonez.co.uk/api/v1/products/${categorysplit}/${brand}/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data.product.prodname)
        setDataretrvieved(data)
        setLoading(false)
      })
    
  }, [brand, categorysplit, id]) 

  if (isLoading) return <div className={styles.pagemaindyn}><Loader/></div>
  if (!dataretrvieved) return <div className={styles.pagemaindyn}>No data</div>
  
  if (dataretrvieved.status === "success") {

    return (
      <div className={styles.pagemaindyn}>
        <div className={styles.pagemaindyn}>
          <div className={styles.ovalblurdyn}></div>
          <div className={styles.pagedyn}>
          <div className={styles.phoneprice}>          
            <Image 
            src={dataretrvieved.product.imagetwo}
            alt="Main image"
            width={354}
            height={438}
          />
          <h2>£{dataretrvieved.product.price}</h2>
          </div>
          <div className={styles.descript}>
            <h4>{dataretrvieved.product.prodname}</h4>
            <span>{dataretrvieved.product.proddescr}</span>
            <div className={styles.descripttwo}>            
              <h2>{dataretrvieved.product.memory}</h2>
              <h2>{dataretrvieved.product.color}</h2>
            </div>
            <h3>{dataretrvieved.product.prodname}</h3>

            <h2 className={styles.hiddh2}>{dataretrvieved.product.proddescr}</h2>
            <div className={styles.actionbutton} onClick={() => dispatch(addToCart(dataretrvieved.product), console.log(dataretrvieved.product.prodname))}>
              Add to cart
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }
}