'use client';
import { useEffect, useState } from 'react';

type AnalyticsData = {
    totalRevenue: number;
    totalOrders: number;
    ordersByStatus: Array<{ status: string; _count: { status: number } }>;
    bestSellingProducts: Array<{ productId: number; productName: string; quantitySold: number }>;
};

export default function Analytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await fetch('http://54.179.39.154:5000/api/analytics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [token]);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Analytics</h1>
            {loading ? (
                <p>Loading analytics...</p>
            ) : data ? (
                <div>
                    <p>Total Revenue: ${data.totalRevenue}</p>
                    <p>Total Orders: {data.totalOrders}</p>
                    <h3>Orders by Status:</h3>
                    <ul>
                        {data.ordersByStatus.map((statusItem, index) => (
                            <li key={index}>
                                {statusItem.status}: {statusItem._count.status}
                            </li>
                        ))}
                    </ul>
                    <h3>Best Selling Products:</h3>
                    <ul>
                        {data.bestSellingProducts.map((prod, index) => (
                            <li key={index}>
                                {prod.productName} (ID: {prod.productId}) - Quantity Sold: {prod.quantitySold}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No analytics data available.</p>
            )}
        </div>
    );
}
