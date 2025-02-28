"use client"
import React, { useState, useEffect } from 'react';
import { Upload, Loader2 } from 'lucide-react';

type Category = {
    id: number;
    name: string;
};

function App() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [quantity, setQuantity] = useState<number | undefined>(undefined);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('http://54.179.39.154:5000/api/categories');
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };
        fetchCategories();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImageFile(file);

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Cleanup preview URL when component unmounts
            return () => URL.revokeObjectURL(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !quantity || !imageFile) {
            alert("Please fill in all required fields");
            return;
        }
        setLoading(true);
        if (!token) {
            alert("Please login as admin.");
            setLoading(false);
            return;
        }
        try {
            // Request a pre-signed URL for S3 upload from the backend
            const signRes = await fetch('http://54.179.39.154:5000/api/s3/sign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fileName: imageFile.name,
                    fileType: imageFile.type
                })
            });

            const signData = await signRes.json();
            if (!signRes.ok) {
                throw new Error(signData.error || "Failed to get pre-signed URL");
            }

            const { url: presignedUrl, key: fileKey } = signData;

            // Upload the file to S3 using the pre-signed URL
            const uploadRes = await fetch(presignedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': imageFile.type },
                body: imageFile
            });

            if (!uploadRes.ok) {
                throw new Error("Failed to upload image to S3");
            }

            const imageUrl = `https://aurum-knitting.s3.us-east-1.amazonaws.com/${fileKey}`;

            // Create the product
            const productRes = await fetch('http://54.179.39.154:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    description,
                    price,
                    quantity,
                    imageUrl,
                    categoryId: selectedCategory === '' ? null : selectedCategory
                })
            });

            const productData = await productRes.json();
            if (!productRes.ok) {
                throw new Error(productData.error || "Failed to create product");
            }

            alert("Product created successfully");
            // Reset form
            setName('');
            setDescription('');
            setPrice(undefined);
            setQuantity(undefined);
            setImageFile(null);
            setPreviewUrl(null);
            setSelectedCategory('');
        } catch (error: any) {
            console.error(error);
            alert(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen  py-8">
            <div className="max-w-3xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

                <form onSubmit={handleSubmit} className=" rounded-lg  p-6 space-y-6">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter product description"
                        />
                    </div>

                    {/* Price and Quantity Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($) *
                            </label>
                            <input
                                type="number"
                                id="price"
                                value={price ?? ''}
                                onChange={e => setPrice(parseFloat(e.target.value))}
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity ?? ''}
                                onChange={e => setQuantity(parseInt(e.target.value))}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>

                    {/* Category Select */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value === '' ? '' : parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Image *
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {previewUrl ? (
                                    <div className="mb-4">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="mx-auto h-32 w-32 object-cover rounded-md"
                                        />
                                    </div>
                                ) : (
                                    <Upload
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        strokeWidth={1}
                                    />
                                )}
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="image-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="sr-only"
                                            required
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }
              `}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Creating Product...
                                </>
                            ) : (
                                'Create Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default App;
