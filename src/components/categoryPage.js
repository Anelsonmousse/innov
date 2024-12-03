import { Product, Tag } from "@/assets";
import Header from "@/components/header";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoHeartOutline, IoHeart } from "react-icons/io5";

// Helper function to fetch categories (server-side)
async function fetchCategories() {
    const response = await fetch("https://api.vplaza.com.ng/categories");
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    return data.categories;
}

// Helper function to fetch products for a specific category (server-side)
async function fetchProductsByCategory(category) {
    const response = await fetch(`https://api.vplaza.com.ng/products?category=${category}`);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data.products;
}

// Generate paths for each category
export async function getStaticPaths() {
    try {
        const categories = await fetchCategories();
        const paths = categories.map((category) => ({
            params: { category: category.slug },
        }));
        return { paths, fallback: false }; // Set `fallback: true` if you want to handle non-static paths
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { paths: [], fallback: true };
    }
}

// Fetch products and category data during build
export async function getStaticProps({ params }) {
    try {
        const products = await fetchProductsByCategory(params.category);
        return {
            props: {
                category: params.category,
                products,
            },
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            props: {
                category: params.category,
                products: [],
            },
        };
    }
}
