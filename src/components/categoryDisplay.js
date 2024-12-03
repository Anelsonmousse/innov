"use client"

import { useState } from "react";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa";
import Header from "@/components/header";

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

const CategoryDisplay = ({ category, products }) => {
    const [wishlistStates, setWishlistStates] = useState({});

    // Initialize wishlist states
    useState(() => {
        const initialWishlistStates = {};
        products.forEach((product) => {
            initialWishlistStates[product.details.product_id] = product.inWishList === 1;
        });
        setWishlistStates(initialWishlistStates);
    }, [products]);

    const toggleWishlist = (productId) => {
        setWishlistStates((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    return (
        <main className="pt-8 px-2">
            <Header title={category[0].toUpperCase() + category.slice(1).toLowerCase()} />
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        >
                            <div className="p-3 relative">
                                <div className="relative">
                                    <img
                                        src={product.details.product_img1}
                                        className="w-full aspect-square object-cover rounded-lg"
                                        alt={product.details.product_name}
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
                                        <StarRating rating={product.details.rating || "0"} />
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

export default CategoryDisplay;
