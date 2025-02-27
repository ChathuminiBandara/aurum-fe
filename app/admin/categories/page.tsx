"use client"
import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, X, Check, Plus } from 'lucide-react';
import api from "@/lib/api";

type Category = {
    id: number;
    name: string;
    description?: string;
};

function App() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        console.log(token)
    }, []);

    const handleDelete = async (categoryId: number) => {
        if (!token) {
            alert('You must be logged in to perform this action');
            return;
        }

        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.ok) {
                setCategories(categories.filter(cat => cat.id !== categoryId));
            } else {
                alert('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleEdit = (cat: Category) => {
        setEditingCategory(cat);
        setName(cat.name);
        setDescription(cat.description || '');
    };

    const handleUpdate = async () => {
        if (!token || !editingCategory) {
            alert('You must be logged in to perform this action');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/categories/${editingCategory.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            });

            if (res.ok) {
                const updatedCategories = categories.map(cat =>
                    cat.id === editingCategory.id ? { ...cat, name, description } : cat
                );
                setCategories(updatedCategories);
                setEditingCategory(null);
                resetForm();
            } else {
                alert('Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleAdd = async () => {
        if (!token) {
            alert('You must be logged in to perform this action');
            return;
        }

        try {

            const res = await fetch('http://localhost:5000/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, role:'admin' }),
            });

            if (res.ok) {
                const newCategory = await res.json();
                setCategories([...categories, newCategory]);
                setIsAdding(false);
                resetForm();
            } else {
                alert('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
    };

    const handleCancel = () => {
        setEditingCategory(null);
        setIsAdding(false);
        resetForm();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
                    {!isAdding && !editingCategory && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} /> Add Category
                        </button>
                    )}
                </div>

                {/* Add/Edit Form */}
                {(isAdding || editingCategory) && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {isAdding ? 'Add New Category' : 'Edit Category'}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter category name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Enter category description"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={isAdding ? handleAdd : handleUpdate}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                                >
                                    <Check size={20} />
                                    {isAdding ? 'Add' : 'Update'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Categories List */}
                <div className="bg-white rounded-lg shadow-md">
                    {categories.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No categories found. Add your first category!
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {categories.map((category) => (
                                <li key={category.id} className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {category.name}
                                            </h3>
                                            <p className="mt-1 text-gray-600">
                                                {category.description || 'No description provided'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-blue-600 hover:text-blue-800 p-2"
                                                title="Edit"
                                            >
                                                <Pencil size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="text-red-600 hover:text-red-800 p-2"
                                                title="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
