"use client";
import { Product, Tag } from "@/assets";
import Header from "@/components/header";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoFunnel, IoHeartOutline, IoHeart } from "react-icons/io5";
import { useEffect, useState } from 'react';
import axios from "axios";

const StarRating = ({ rating }) => {
    const totalStars = 5;
    const ratingNumber = parseInt(rating) || 0;
    
    return (
        <div className="flex">
            {[...Array(totalStars)].map((_, index) => (
                <span key={index}>
                    {index < ratingNumber ? (
                        <FaStar size={10} className="fill-[#FFF500]" />
                    ) : (
                        <FaRegStar size={10} className="fill-[#FFF500]" />
                    )}
                </span>
            ))}
        </div>
    );
};

const page = () => {
    const router = useRouter();
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistAction, setWishlistAction] = useState("");
    const [wishlistStates, setWishlistStates] = useState({});
    const [token, setToken] = useState(null);
    const requestID = "rid_1983";

    useEffect(() => {
        const categoryData = JSON.parse(localStorage.getItem('categoryData'));
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        
        if (categoryData && categoryData.products) {
            setProducts(categoryData.products);
            // Initialize wishlist states
            const initialWishlistStates = {};
            categoryData.products.forEach(product => {
                initialWishlistStates[product.details.product_id] = product.inWishList === 1;
            });
            setWishlistStates(initialWishlistStates);
        }
        
        setLoading(false);
    }, []);

    const handleProductClick = (product) => {
        if (!token) {
            router.push("/signin");
        } else {
            // Store the product data before navigation
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            router.push(`/product/${product.details.product_id}`);
        }
    };

    const toggleWishlist = async (product, event) => {
        // Prevent the click event from bubbling up to the product card
        event.stopPropagation();
        
        setLoading(true);
        try {
            if (!token) {
                router.push("/signin");
                return;
            }

            const productId = product.details.product_id;
            const inWishlist = wishlistStates[productId];
            
            setWishlistAction(inWishlist ? "Removing from wishlist..." : "Adding to wishlist...");
            
            const endpoint = inWishlist
                ? "https://api.vplaza.com.ng/products/removeFromWishList"
                : "https://api.vplaza.com.ng/products/addToWishList";
            
            const response = await axios.post(
                endpoint,
                {
                    product_id: productId,
                    requestID,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                // Update wishlist state locally
                setWishlistStates(prev => ({
                    ...prev,
                    [productId]: !inWishlist
                }));

                // Update products in localStorage
                const categoryData = JSON.parse(localStorage.getItem('categoryData'));
                const updatedProducts = categoryData.products.map(p => {
                    if (p.details.product_id === productId) {
                        return { ...p, inWishList: inWishlist ? 0 : 1 };
                    }
                    return p;
                });
                localStorage.setItem('categoryData', JSON.stringify({
                    ...categoryData,
                    products: updatedProducts
                }));

                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            if (error.response?.data?.message === "signature verification failed") {
                router.push("/signin");
            }
        } finally {
            setLoading(false);
        }
    };

    const getRating = (product) => {
        if (product.reviews && product.reviews.length > 0) {
            return product.reviews[0].rating;
        }
        return "0";
    };

    if (loading) {
        return (
            <main className="pt-8 px-2">
                <Header title="Loading..." />
                <div className="w-full text-center p-4">
                    <p>{wishlistAction || "Processing..."}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-8 px-2">
            <Header
                title={category[0].toUpperCase() + category.slice(1).toLowerCase()}
            />
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <div 
                            key={index} 
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                            onClick={() => handleProductClick(product)}
                        >
                            <div className="p-3 relative">
                                <div className="relative">
                                    <img
                                        src={product.details.product_img1}
                                        className="w-full aspect-square object-cover rounded-lg"
                                        alt={product.details.product_name}
                                    />
                                    <button 
                                        onClick={(e) => toggleWishlist(product, e)}
                                        className="p-2 bg-main rounded-full absolute right-2 top-2 transition-all hover:scale-110 hover:bg-opacity-90"
                                    >
                                        {wishlistStates[product.details.product_id] ? (
                                            <IoHeart size={20} className="fill-white" />
                                        ) : (
                                            <IoHeartOutline size={20} className="stroke-white" />
                                        )}
                                    </button>
                                </div>

                                <div className="mt-3 space-y-2">
                                    <h1 className="font-bold text-sm line-clamp-2">
                                        {product.details.product_name}
                                    </h1>
                                    
                                    <div className="flex items-center justify-between">
                                        <StarRating rating={getRating(product)} />
                                        <span className="text-xs bg-[#D9D9D9] px-2 py-1 rounded">
                                            {product.shopDetails.shop_name}
                                        </span>
                                    </div>
                                    
                                    <p className="font-semibold text-lg">
                                        ₦{parseInt(product.details.amount).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No products found for this category.</p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default page;