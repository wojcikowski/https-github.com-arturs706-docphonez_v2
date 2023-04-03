"use client";

import {useState} from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";


const ProductTable = ({ products }) => {
    const [priceFilters, setPriceFilters] = useState([]);
    const [brandFilter, setBrandFilter] = useState([]);
    const [colorFilter, setColorFilter] = useState([]);
    const [ratingFilter, setRatingFilter] = useState([]);

    console.log(products)
   

      const productFilter = (products, priceRanges, brands, colors, rating) => {
        let filteredProducts = products;
      
        if (Array.isArray(priceRanges) && priceRanges.length > 0) {
          filteredProducts = filteredProducts.filter(product => {
            return priceRanges.some(range => {
              const [minPrice, maxPrice] = range.split("-");
              return product.price >= Number(minPrice) && product.price <= Number(maxPrice);
            });
          });
        }
      
        if (Array.isArray(brands) && brands.length > 0) {
          filteredProducts = filteredProducts.filter(product => brands.includes(product.brand));
        }
      
        if (Array.isArray(colors) && colors.length > 0) {
          filteredProducts = filteredProducts.filter(product => colors.includes(product.color));
        }

        if (Array.isArray(rating) && rating.length > 0) {
            filteredProducts = filteredProducts.filter(product => rating.includes(product.rating));
          }
      
        return filteredProducts;
      };
      
    

    return (
        <div className={styles.pagemain}>
          <div className={styles.ovalblur}></div>
          <div className={styles.searchdiv}>
          </div>
          <div className={styles.divlrgscreenwrap}>
            <div className={styles.divleft}>
                <div className={styles.h5heading}><h5>Filters</h5></div>
                <div>By Price</div>
                    <input type="checkbox" id="0-700" name="price" value="0-700" checked={priceFilters.includes("0-700")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setPriceFilters(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "0-700"];
                        } else {
                        return prevFilters.filter(filter => filter !== "0-700");
                        }
                    });
                    }}/>
                    <label>£0 - £700</label>
                    <br />
                    <input type="checkbox" id="700-1000" name="price" value="700-1000" checked={priceFilters.includes("700-1000")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setPriceFilters(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "700-1000"];
                        } else {
                        return prevFilters.filter(filter => filter !== "700-1000");
                        }
                    });
                    }}/>
                    <label>£700 - £1000</label>
                    <br />
                    <input type="checkbox" id="1000-1500" name="price" value="1000-1500" checked={priceFilters.includes("1000-1500")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setPriceFilters(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "1000-1500"];
                        } else {
                        return prevFilters.filter(filter => filter !== "1000-1500");
                        }
                    });
                    }}/>
                    <label>£1000 - £1500</label>
                    <br />
                <div>By Brand</div>
                    <input type="checkbox" id="apple" name="brand" value="apple" checked={brandFilter.includes("apple")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setBrandFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "apple"];
                        } else {
                        return prevFilters.filter(filter => filter !== "apple");
                        }
                    });
                    }}/>
                    <label htmlFor="apple">Apple</label>
                    <br />
                    <input type="checkbox" id="samsung" name="brand" value="samsung" checked={brandFilter.includes("samsung")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setBrandFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "samsung"];
                        } else {
                        return prevFilters.filter(filter => filter !== "samsung");
                        }
                    });
                    }}/>
                    <label htmlFor="samsung">Samsung</label>
                    <br />
                <div>By Color</div>
                    <input type="checkbox" id="black" name="color" value="black" checked={colorFilter.includes("black")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "black"];
                        } else {
                        return prevFilters.filter(filter => filter !== "black");
                        }
                    });
                    }}/>
                    <label htmlFor="black">Black</label>
                    <br/>
                    <input type="checkbox" id="white" name="color" value="white" checked={colorFilter.includes("white")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "white"];
                        } else {
                        return prevFilters.filter(filter => filter !== "white");
                        }
                    });
                    }}/>
                    <label htmlFor="white">White</label>
                    <br/>
                    <input type="checkbox" id="gray" name="color" value="gray" checked={colorFilter.includes("gray")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "gray"];
                        } else {
                        return prevFilters.filter(filter => filter !== "gray");
                        }
                    });
                    }}/>
                    <label htmlFor="gray">Grey</label>
                    <br/>
                    <input type="checkbox" id="blue" name="color" value="blue" checked={colorFilter.includes("blue")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "blue"];
                        } else {
                        return prevFilters.filter(filter => filter !== "blue");
                        }
                    });
                    }}/>
                    <label htmlFor="blue">Blue</label>
                    <br/>
                    <input type="checkbox" id="red" name="color" value="red" checked={colorFilter.includes("red")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "red"];
                        } else {
                        return prevFilters.filter(filter => filter !== "red");
                        }
                    });
                    }}/>
                    <label htmlFor="red">Red</label>
                    <br/>
                    <input type="checkbox" id="green" name="color" value="green" checked={colorFilter.includes("green")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "green"];
                        } else {
                        return prevFilters.filter(filter => filter !== "green");
                        }
                    });
                    }}/>
                    <label htmlFor="green">Green</label>
                    <br/>
                    <input type="checkbox" id="yellow" name="color" value="yellow" checked={colorFilter.includes("yellow")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "yellow"];
                        } else {
                        return prevFilters.filter(filter => filter !== "yellow");
                        }
                    });
                    }}/>
                    <label htmlFor="yellow">yellow</label>
                    <br/>
                    <input type="checkbox" id="pink" name="color" value="pink" checked={colorFilter.includes("pink")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "pink"];
                        } else {
                        return prevFilters.filter(filter => filter !== "pink");
                        }
                    });
                    }}/>
                    <label htmlFor="pink">Pink</label>
                    <br/>
                    <input type="checkbox" id="purple" name="color" value="purple" checked={colorFilter.includes("purple")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "purple"];
                        } else {
                        return prevFilters.filter(filter => filter !== "purple");
                        }
                    });
                    }}/>
                    <label htmlFor="purple">Purple</label>
                    <br/>
                <div>By Rating</div>
                <input type="checkbox" id="1" name="rating" value="1" checked={ratingFilter.includes("1")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRatingFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "1"];
                        } else {
                        return prevFilters.filter(filter => filter !== "1");
                        }
                    });
                    }}/>
                    <label htmlFor="1">1 or more</label>
                    <br/>
                <input type="checkbox" id="2" name="rating" value="2" checked={ratingFilter.includes("2")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRatingFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "2"];
                        } else {
                        return prevFilters.filter(filter => filter !== "2");
                        }
                    });
                    }}/>
                    <label htmlFor="2">2 or more</label>
                    <br/>
                    <input type="checkbox" id="3" name="rating" value="3" checked={ratingFilter.includes("3")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRatingFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "3"];
                        } else {
                        return prevFilters.filter(filter => filter !== "3");
                        }
                    });
                    }}/>
                    <label htmlFor="3">3 or more</label>
                    <br/>
                    <input type="checkbox" id="4" name="rating" value="4" checked={ratingFilter.includes("4")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRatingFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "4"];
                        } else {
                        return prevFilters.filter(filter => filter !== "4");
                        }
                    });
                    }}/>
                    <label htmlFor="4">4 or more</label>
                    <br/>
                    <input type="checkbox" id="5" name="rating" value="5" checked={ratingFilter.includes("5")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRatingFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "5"];
                        } else {
                        return prevFilters.filter(filter => filter !== "5");
                        }
                    });
                    }}/>
                    <label htmlFor="5">5 or more</label>
                    <br/>


            </div>
            <div className={styles.divright}>
              <div className={styles.topbar}>
                <div className={styles.righttopdiv}>
                  <div>Sort by</div>
                  <select className={styles.select}></select>
                </div>
              </div>
              <div className={styles.productdiv}>
                
              {productFilter(products, priceFilters, brandFilter, colorFilter, ratingFilter).map(product => (
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

export default ProductTable;