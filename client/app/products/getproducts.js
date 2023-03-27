export default async function GetProducts() {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/products', { next: { revalidate: 60 }})

    if (!res.ok) {
        throw new Error(res.statusText)
    }
    return res.json()
}