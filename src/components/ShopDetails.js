import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import Loader from "@/components/Loader";

const ShopDetails = ({ product }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // Filtered product list
  const reviewsPerPage = 5;
  const requestID = "rid_1983"; // static request ID

  const products = product.data || []; // Ensure product.data is an array

  useEffect(() => {
    setItems(products);
    setFilteredItems(products); // Initially show all products
  }, [products]);

  // Function to filter items based on search query
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter products based on the search query
    const filtered = items.filter((item) =>
      item.details.product_name.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

  return (
    <main className="">
      <div className="bg-[#D9D9D9] mx-4 flex items-center gap-1 my-4 p-2 relative rounded-xl">
        <IoSearch size={20} className="shrink-0" fill="#979797" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="bg-transparent shrink min-w-0 max-w-full outline-none flex-1"
          placeholder="Search products..."
        />
      </div>

      <div className="flex items-center w-full">
        <img
          src={product.shop_img_url}
          className="w-[150px] h-[150px] object-cover rounded-full ml-10"
          alt="view"
        />
        <div className="ml-4">
          <h1 className="font-black text-2xl">{product.shop_name}</h1>
          <p className="text-[10px]">{product.shop_desc}</p>
        </div>
      </div>

      {/* Product listing */}
      <section className="grid grid-cols-2 w-full gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-2 text-center text-xl">No products found</div>
        ) : (
          filteredItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-left p-4 rounded cursor-pointer transition-all hover:shadow-lg"
            >
              <img
                src={item.details.product_img1} // Use the first product image
                className="rounded-lg w-40 h-40 object-cover rounded-[7px]"
                alt={item.details.product_name}
                width={300} // Image width for optimization in Next.js
                height={300} // Image height for optimization in Next.js
              />
              <div className="w-full">
                <div className="mt-2 text-[12px] font-bold">
                  {item.details.product_name} {/* Product name */}
                </div>
              </div>
              <div className="flex flex-col text-[10px] w-full">
                <p className="flex items-center">
                  {item.average_r.average ?? "No rating"}{" "}
                  {/* Show average rating if available */}
                  <span className="inline-block">
                    <FaStar size={10} className="fill-[#FFF500]" />
                  </span>
                </p>
              </div>
              <p className="font-semibold flex w-full text-lg">
                ₦{parseInt(item.details.amount).toLocaleString()}{" "}
                {/* Display the price */}
              </p>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default ShopDetails;
