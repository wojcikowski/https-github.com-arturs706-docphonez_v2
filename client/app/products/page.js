"use client";

import { useState } from 'react'
import styles from './page.module.css'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import refreshToken from '../../checkCr';
import Image from 'next/image'
import Link from 'next/link'

function Page() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dispatch = useDispatch()
  const [prodLenght, setProdLenght] = useState(0);

  useEffect(() => {
    async function checkRefreshToken() {
      await refreshToken(dispatch);
    }
    
    checkRefreshToken();
  }, [dispatch]);

  useEffect(() => {
    // fetch(`${process.env.NEXT_PUBLIC_API_URL}api/v1/products`)
    fetch("https://pm.doctorphonez.co.uk/api/v1/products")
      .then(res => res.json())
      .then(data => {
        {
          setProducts(data.products)
          setProdLenght(data.products.length)
        }
      }
      );
  }, []);

  function searchProducts(products, query) {
    return products.filter(product =>
      product.prodname.toLowerCase().includes(query.toLowerCase())
    );
  }

  useEffect(() => {
    if (searchQuery !== '') {
      const results = searchProducts(products, searchQuery);
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, products]);

  if (searchQuery !== '') {
    return (
      <div className={styles.pagemain}>
      <div className={styles.ovalblur}></div>
      <div className={styles.searchwrapper}>
        <input
          type="text"
          placeholder="Search products"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          className={styles.searchdivrel}
        />
      </div>
      <div className={styles.popupwindow}>
      {filteredProducts.length > 0 && (
        <div className>
          {filteredProducts.map(product => (
            <Link key={product.id} href={`/products/${product.category}/${product.brand}/${product.productid}` }>
            <div key={product.id} className={styles.searchsdiv}>
              <Image 
                src={product.imagetwo}
                alt={product.prodname}
                width={55}
                height={60}
              />
              <div className={styles.text}>{product.prodname}</div>
              <div className={styles.texttwo}>£{product.price}</div>
            </div>
            </Link>
          ))}
        </div>
      )}
      </div>
      </div>
    )
  }

  return (
    <div className={styles.pagemain}>
      <div className={styles.ovalblur}></div>
      <div className={styles.searchdiv}>
        <input
          type="text"
          placeholder="Search products"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          className={styles.searchinput}
        />
      </div>
      <div className={styles.divlrgscreenwrap}>
        <div className={styles.divleft}>Filters</div>
        <div className={styles.divright}>
          <div className={styles.topbar}>
            <div>Found {prodLenght} items on search</div>
            <div className={styles.righttopdiv}>
              <div>Sort by</div>
              <select className={styles.select}></select>
            </div>
          </div>
          <div className={styles.productdiv}>
          {products.map(product => (
            <Link key={product.productid} href={`/products/${product.category}/${product.brand}/${product.productid}` }>
            <div key={product.productid} className={styles.productsquare}>
              {
                product.brand === "apple" ? 
                <Image
                src={product.imagetwo}
                alt={product.prodname}
                width={275}
                height={360}
              />
              :
              <Image
              src={product.imagetwo}
              alt={product.prodname}
              width={327}
              height={360}
            />
              }
              <div className={styles.prodnamediv}>
                {product.prodname}
                <Image 
                  src={`https://res.cloudinary.com/dyvgcv5se/image/upload/v1679991563/etc/${product.color}active.svg`}
                  alt="Main image"
                  width={32}
                  height={31}
                />

              </div>
              <div className={styles.prodpricediv}>£{product.price}</div>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
