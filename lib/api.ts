import axios from "axios"
import { auth } from "@/lib/firebase"

const API_BASE_URL = "http://13.229.57.3:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Axios Request Interceptor to Attach Firebase Token
api.interceptors.request.use(
    async (config) => {
      let token = localStorage.getItem("token")
      console.log(token, "API")
      if (token) {
        try {
          config.headers.Authorization = `Bearer ${token}`
        } catch (error) {
          console.error("Error fetching Firebase token:", error)
        }
      }
      return config
    },
    (error) => Promise.reject(error)
)

// API Requests
export const getProducts = async (params?: {
  search?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
}) => {
  const response = await api.get("/products", { params })
  return response.data
}

export const getProductById = async (id: number) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const createProduct = async (productData: any) => {
  const response = await api.post("/products", productData)
  return response.data
}

export const updateProduct = async (id: number, productData: any) => {
  const response = await api.put(`/products/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

export const getCategories = async () => {
  const response = await api.get("/categories")
  return response.data
}

export const addToCart = async (productId: number, quantity: number) => {
  const response = await api.post("/cart", { productId, quantity })
  return response.data
}

export const getCart = async () => {
  const response = await api.get("/cart")
  return response.data
}

export const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await api.put(`/cart/${itemId}`, { quantity })
  return response.data
}

export const removeCartItem = async (itemId: number) => {
  const response = await api.delete(`/cart/${itemId}`)
  return response.data
}

export const createCheckoutSession = async (items: { productId: number; quantity: number }[]) => {
  const response = await api.post("/orders/checkout", { items })
  return response.data
}

export const getFavorites = async () => {
  const response = await api.get("/favorites")
  return response.data
}

export const addFavorite = async (productId: number) => {
  const response = await api.post("/favorites", { productId })
  return response.data
}

export const removeFavorite = async (favoriteId: number) => {
  const response = await api.delete(`/favorites/${favoriteId}`)
  return response.data
}

export const getCustomerProfile = async () => {
  const response = await api.get("/customers/me")
  return response.data
}

export const updateCustomerProfile = async (profileData: any) => {
  const response = await api.put("/customers/me", profileData)
  return response.data
}

export const getCustomerOrders = async () => {
  const response = await api.get("/orders")
  return response.data
}

export const getReviewsForProduct = async (productId: number) => {
  const response = await api.get(`/reviews/product/${productId}`)
  return response.data
}

export const createReview = async (reviewData: { productId: number; rating: number; reviewText: string }) => {
  const response = await api.post("/reviews", reviewData)
  return response.data
}

export default api
