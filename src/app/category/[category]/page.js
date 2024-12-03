import { Product, Tag } from "@/assets";
import Header from "@/components/header";
import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";

// Fetch categories during build time
export async function generateStaticParams() {
    try {
        const response = await axios.get("https://api.vplaza.com.ng/categories");
        if (response.status === 200) {
            return response.data.categories.map((category) => ({
                category: category.slug,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

// Fetch initial product data (can be optional if you want dynamic client-side fetch only)
export async function getStaticProps({ params }) {
    try {
        const response = await axios.get(`https://api.vplaza.com.ng/products?category=${params.category}`);
        return {
            props: {
                initialProducts: response.data.products || [],
                category: params.category,
            },
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { props: { initialProducts: [], category: params.category } };
    }
}

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

const CategoryPage = ({ initialProducts, category }) => {
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(!initialProducts.length);
    const [wishlistStates, setWishlistStates] = useState({});
    const [token, setToken] = useState(null);
    const requestID = "rid_1983";

    useEffect(() => {
        const fetchProducts = async () => {
            if (!initialProducts.length) {
                setLoading(true);
                try {
                    const response = await axios.get(`https://api.vplaza.com.ng/products?category=${category}`);
                    setProducts(response.data.products || []);
                } catch (error) {
                    console.error("Error fetching products:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, [category, initialProducts]);

    useEffect(() => {
        const initialWishlistStates = {};
        products.forEach((product) => {
            initialWishlistStates[product.details.product_id] = product.inWishList === 1;
        });
        setWishlistStates(initialWishlistStates);
    }, [products]);

    const toggleWishlist = async (product, event) => {
        event.stopPropagation();

        setLoading(true);
        try {
            if (!token) {
                router.push("/signin");
                return;
            }

            const productId = product.details.product_id;
            const inWishlist = wishlistStates[productId];

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
                setWishlistStates((prev) => ({
                    ...prev,
                    [productId]: !inWishlist,
                }));
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
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
                    <p>Loading products...</p>
                </div>
            </main>
        );
    }

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

export default CategoryPage;
