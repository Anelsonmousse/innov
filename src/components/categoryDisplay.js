"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa";
import Header from "@/components/header";

const StarRating = ({ rating }) => {
    const totalStars = 5;
    const ratingNumber = parseInt(rating, 10) || 0;

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

const CategoryDisplay = ({ category, products }) => {
    const [wishlistStates, setWishlistStates] = useState({});
    const router = useRouter();

    // Initialize wishlist states when the component mounts or when `products` changes
    useEffect(() => {
        if (products && products.data.length > 0) {
            const initialWishlistStates = products.data.reduce((states, product) => {
                states[product.product_id] = product.wishlist === 1;
                return states;
            }, {});
            setWishlistStates(initialWishlistStates);
        }
    }, [products]);

    const toggleWishlist = (productId) => {
        setWishlistStates((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    return (
        <main className="pt-8 px-2">
            <Header
                title={
                    category
                        ? category[0].toUpperCase() + category.slice(1).toLowerCase()
                        : "Category"
                }
            />
            <section key={products.data?.product_id} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {products.data?.length > 0 ? (
                    products.data.map((product) => (
                        <div
                        onClick={() => router.push(`/product/${product.details.product_id}`)}
                            key={product.details.product_id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        >
                            <div className="p-3 relative">
                                <div className="relative">
                                    <img
                                        src={product.details.product_img1}
                                        className="w-full aspect-square object-cover rounded-lg"
                                        alt={product.product_name}
                                    />
                                    <button
                                        onClick={() => toggleWishlist(product.details.product_id)}
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
                                        <StarRating rating={product.details.ratings || "0"} />
                                        <span className="text-xs bg-[#D9D9D9] px-2 py-1 rounded">
                                            {product.shopDetails?.shop_name}
                                        </span>
                                    </div>
                                    <p className="font-semibold text-lg">
                                        ₦{parseInt(product.details.amount, 10).toLocaleString()}
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

export default CategoryDisplay;
