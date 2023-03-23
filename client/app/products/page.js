import React from 'react'
import styles from './page.module.css'
import Getproducts from './getproducts'

export default function page() {
  return (
    <div className={styles.pagemain}>
      <Getproducts/>
    </div>
  )
}
