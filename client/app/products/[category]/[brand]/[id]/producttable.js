'use client'
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../../../redux/reducers/cartSlice'
import Loader from './Loader';
import refreshToken from '../../../../../checkCr';

export default function Home({ products }) {
  const dispatch = useDispatch()

  useEffect(() => {
      async function checkRefreshToken() {
        await refreshToken(dispatch);
      }
      checkRefreshToken();
    }, [dispatch]);

  const [dataretrvieved, setDataretrvieved] = useState(null)
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
      setDataretrvieved(products)
      setLoading(false)
  }, [products])
  

  if (isLoading) return <div className={styles.pagemaindyn}><Loader/></div>
  if (!dataretrvieved) return <div className={styles.pagemaindyn}>No data</div>
  
  if (dataretrvieved) {

    return (
      <div className={styles.pagemaindyn}>
        <div className={styles.pagemaindyn}>
          <div className={styles.ovalblurdyn}></div>
          <div className={styles.pagedyn}>
          <div className={styles.phoneprice}>          
            <Image 
            src={dataretrvieved.product.imageone}
            alt="Main image"
            width={354}
            height={438}
          />
          <h3>£{dataretrvieved.product.price}</h3>
          </div>
          <div className={styles.descript}>
            <h4>{dataretrvieved.product.prodname}</h4>
            <span>{dataretrvieved.product.proddescr}</span>
            <div className={styles.descripttwo}>            
              <h2>{dataretrvieved.product.memory}</h2>
              <Image 
                src={`https://res.cloudinary.com/dyvgcv5se/image/upload/v1679991563/etc/${dataretrvieved.product.color}active.svg`}
                alt="Main image"
                width={32}
                height={31}
              />

            </div>
            <h3>{dataretrvieved.product.prodname}</h3>

            <h2 className={styles.hiddh2}>{dataretrvieved.product.proddescr}</h2>
            <div className={styles.actionbutton} onClick={() => dispatch(addToCart(dataretrvieved.product))}>
              Add to cart
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }
}

