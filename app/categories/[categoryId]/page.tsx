'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Product = {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl: string;
    quantity: number;
};

export default function CategoryProducts() {
    const { categoryId } = useParams();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/categories/${categoryId}/products`);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products by category:', error);
            }
        };
        if (categoryId) fetchProducts();
    }, [categoryId]);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Category: {categoryId}</h1>
            {products.length === 0 ? (
                <p>No products in this category.</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1rem'
                }}>
                    {products.map(product => (
                        <div key={product.id} style={{ border: '1px solid #ddd', padding: '1rem' }}>
                            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 'auto' }}/>
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
