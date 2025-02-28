"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/actions/productsActions";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const dispatch = useDispatch();
  // Access the products state from Redux
  const { products, loading, error } = useSelector((state:any) => state.products);

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchProducts(query));
  }, [query, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load products");
    }
  }, [error]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL with search query
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(query)}`);
    // Optionally, you can dispatch fetchProducts here as well if needed.
    dispatch(fetchProducts(query));
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Search Results</h1>
        <form onSubmit={handleSearch} className="mb-8 flex gap-4">
          <Input
              type="text"
              placeholder="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </form>
        {loading ? (
            <div>Loading...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product:any) => (
                  <ProductCard key={product.id} product={product} />
              ))}
            </div>
        )}
      </div>
  );
}
