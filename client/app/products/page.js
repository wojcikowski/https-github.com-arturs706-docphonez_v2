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

  useEffect(() => {
    async function checkRefreshToken() {
      await refreshToken(dispatch);
    }
    
    checkRefreshToken();
  }, [dispatch]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/v1/products`)
      .then(res => res.json())
      .then(data => setProducts(data.products));
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
            <div className={styles.searchsdiv}>
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
      <div className={styles.searchdiv}>
        <input
          type="text"
          placeholder="Search products"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          className={styles.searchinput}
        />
      </div>
    </div>
  );
}

export default Page;
