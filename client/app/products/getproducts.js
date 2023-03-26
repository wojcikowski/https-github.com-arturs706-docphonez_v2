async function getproducts() {
    // let result = await fetch('http://localhost:10000/api/v1/products', { next: { revalidate: 60 }});
    let result = await fetch('https://pm.doctorphonez.co.uk/api/v1/products', { next: { revalidate: 60 }});
    const obj = await result.json()
    // return obj
}

export default async function Getproducts () {

    let users = await getproducts();

    return (
        <div><h1>
        Your activity
        </h1>
        <p>
        </p>
        </div>)
}