

async function getpdcts() {
    let req = await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/products', { next: { revalidate: 60 }})
    return req.json()
}

export default async function GetProducts() {
    let products = await getpdcts()
    console.log(products)
    return (
        <>
            {products.map((product) => (
                <div key={product.id}>
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p>{product.price}</p>
                </div>
            ))}
        </>
        


    )
}