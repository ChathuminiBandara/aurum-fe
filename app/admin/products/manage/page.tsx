'use client';
import { useEffect, useState } from 'react';

type Product = {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl: string;
    quantity: number;
};

export default function AdminProductsManage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.ok) {
                alert("Product deleted successfully");
                fetchProducts();
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product", error);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
    };

    const handleUpdate = async () => {
        if (!token || !editingProduct) return;
        try {
            const res = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editingProduct),
            });
            if (res.ok) {
                alert("Product updated successfully");
                setEditingProduct(null);
                fetchProducts();
            } else {
                alert("Failed to update product");
            }
        } catch (error) {
            console.error("Error updating product", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Admin: Manage Products</h1>
            {loading ? <p>Loading products...</p> : (
                <div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {products.map(product => (
                            <li key={product.id} style={{ marginBottom: '1rem', border: '1px solid #ddd', padding: '1rem' }}>
                                <p><strong>ID:</strong> {product.id}</p>
                                <p><strong>Name:</strong> {product.name}</p>
                                <p><strong>Description:</strong> {product.description}</p>
                                <p><strong>Price:</strong> ${product.price}</p>
                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                <p>
                                    <strong>Image:</strong>
                                    <br />
                                    <img src={product.imageUrl} alt={product.name} style={{ width: '100px', height: 'auto' }} />
                                </p>
                                <button onClick={() => handleEdit(product)} style={{ marginRight: '0.5rem' }}>Edit</button>
                                <button onClick={() => handleDelete(product.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {editingProduct && (
                <div style={{ marginTop: '2rem', border: '1px solid #aaa', padding: '1rem' }}>
                    <h2>Edit Product</h2>
                    <div>
                        <label>Name:</label><br />
                        <input
                            type="text"
                            value={editingProduct.name}
                            onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Description:</label><br />
                        <textarea
                            value={editingProduct.description || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Price:</label><br />
                        <input
                            type="number"
                            value={editingProduct.price}
                            onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label>Quantity:</label><br />
                        <input
                            type="number"
                            value={editingProduct.quantity}
                            onChange={e => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label>Image URL:</label><br />
                        <input
                            type="text"
                            value={editingProduct.imageUrl}
                            onChange={e => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                        />
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <button onClick={handleUpdate} style={{ marginRight: '0.5rem' }}>Update Product</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
