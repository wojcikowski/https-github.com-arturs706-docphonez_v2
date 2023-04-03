require('dotenv').config();
const client = require('../db/conn')
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const query = `
SELECT products.productid, products.prodname, products.proddescr, products.brand, products.category, 
products.modelnr, products.availableqty, products.price, 
productspecs.color, productspecs.subcolor, productspecs.productmodel, productspecs.memory, 
productspecs.rating, productimages.imageone, productimages.imagetwo, 
productimages.imagethree, productimages.imagefour
FROM products
INNER JOIN productspecs 
ON products.modelnr  = productspecs.productmodel
INNER JOIN productimages
ON products.modelnr = productimages.productmodel
WHERE products.prodname LIKE '%SIM Free iPhone 14 Pro Max 5G Mobile Phone%'
ORDER BY random()
LIMIT 2;
`;


router.get('/apple/featured', bodyParser.json(), async (req, res) => {
    try {
        const twoappleproducts = await client.query(query);
        res.status(200).json({ products: twoappleproducts.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
      }
});

const QUERY_ALL_PRODUCTS = `
SELECT 
  products.productid, products.prodname, products.proddescr, products.brand, 
  products.category, products.modelnr, products.availableqty, products.price, 
  productspecs.color, productspecs.subcolor, productspecs.productmodel, productspecs.memory, 
  productspecs.rating, productimages.imageone, productimages.imagetwo, 
  productimages.imagethree, productimages.imagefour
FROM 
  products
INNER JOIN 
  productspecs ON products.modelnr = productspecs.productmodel
INNER JOIN 
  productimages ON products.modelnr = productimages.productmodel
`;

router.get('/', bodyParser.json(), async (req, res) => {
    try {
        const allproducts = await client.query(QUERY_ALL_PRODUCTS);
        res.status(200).json({ products: allproducts.rows, "status": "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
        }
});

const query_category = `SELECT products.productid, products.prodname, products.proddescr, products.brand, products.category, 
    products.modelnr, products.availableqty, products.price, 
    productspecs.color, productspecs.subcolor, productspecs.productmodel, productspecs.memory, 
    productspecs.rating, productimages.imageone, productimages.imagetwo, 
    productimages.imagethree, productimages.imagefour
    FROM products
    INNER JOIN productspecs 
    ON products.modelnr  = productspecs.productmodel
    INNER JOIN productimages
    ON products.modelnr = productimages.productmodel
    where products.category = $1
`;

router.get('/:category', bodyParser.json(), async (req, res) => {
    const category = req.params.category;
    try {
        const products = await client.query(query_category, [category]);
        res.status(200).json({ products: products.rows, "status": "success"  });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

const query_categorybrand = `SELECT products.productid, products.prodname, products.proddescr, products.brand, products.category, 
    products.modelnr, products.availableqty, products.price, 
    productspecs.color, productspecs.productmodel, productspecs.memory, 
    productspecs.rating, productimages.imageone, productimages.imagetwo, 
    productimages.imagethree, productimages.imagefour
    FROM products
    INNER JOIN productspecs 
    ON products.modelnr  = productspecs.productmodel
    INNER JOIN productimages
    ON products.modelnr = productimages.productmodel
    where products.category = $1 AND products.brand = $2
    ORDER BY random()
`;

router.get('/:category/:brand', bodyParser.json(), async (req, res) => {
    const category = req.params.category;
    const brand = req.params.brand;
    try {
        const products = await client.query(query_categorybrand, [category, brand]);
        res.status(200).json({ products: products.rows, "status": "success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

const query_categorybrandsingle = `SELECT products.productid, products.prodname, products.proddescr, products.brand, products.category, 
    products.modelnr, products.availableqty, products.price, 
    productspecs.color, productspecs.productmodel, productspecs.memory, 
    productspecs.rating, productimages.imageone, productimages.imagetwo, 
    productimages.imagethree, productimages.imagefour
    FROM products
    INNER JOIN productspecs 
    ON products.modelnr  = productspecs.productmodel
    INNER JOIN productimages
    ON products.modelnr = productimages.productmodel
    where products.category = $1 AND products.brand = $2 AND products.productid = $3
`;

router.get('/:category/:brand/:productid', bodyParser.json(), async (req, res) => {
    const category = req.params.category;
    const brand = req.params.brand;
    const productid = req.params.productid;
    try {
        const product = await client.query(query_categorybrandsingle, [category, brand, productid]);
        res.status(200).json({ product: product.rows[0], "status": "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


module.exports = router;